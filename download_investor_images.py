#!/usr/bin/env python3
"""
Indian Investor Headshot Downloader
====================================
Downloads real headshot images for each investor using multiple source strategies:
  1. Wikipedia (infobox photos — most reliable for public figures)
  2. DuckDuckGo image search scrape (fallback)
  3. Google Custom Search API (fallback, requires API key)
  4. Generates a clean initials placeholder if all else fails

SETUP:
  pip install requests pillow wikipedia-api beautifulsoup4 duckduckgo-search

USAGE:
  python download_investor_images.py

  Images are saved to ./investor_images/<Person Name>.jpg
  The script also outputs an updated investors.json with corrected image paths.

OPTIONAL — Google Custom Search (higher quality results):
  Set these env vars for Google image search fallback:
    export GOOGLE_API_KEY="your_key"
    export GOOGLE_CSE_ID="your_cse_id"
  Get them at: https://developers.google.com/custom-search/v1/overview
"""

import os
import re
import json
import time
import random
import hashlib
import logging
import requests
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# ── Optional imports (graceful degradation) ────────────────────────────────
try:
    import wikipediaapi
    WIKI_AVAILABLE = True
except ImportError:
    WIKI_AVAILABLE = False
    print("⚠  wikipedia-api not installed. Wikipedia source disabled.")
    print("   Run: pip install wikipedia-api")

try:
    from bs4 import BeautifulSoup
    BS4_AVAILABLE = True
except ImportError:
    BS4_AVAILABLE = False
    print("⚠  beautifulsoup4 not installed. Some scrapers disabled.")
    print("   Run: pip install beautifulsoup4")

try:
    from duckduckgo_search import DDGS
    DDG_AVAILABLE = True
except ImportError:
    DDG_AVAILABLE = False
    print("⚠  duckduckgo-search not installed. DDG source disabled.")
    print("   Run: pip install duckduckgo-search")

# ── Configuration ───────────────────────────────────────────────────────────
OUTPUT_DIR        = Path("./investor_images")
JSON_INPUT        = Path("./investors_export.json")
JSON_OUTPUT       = Path("./indian_investors_with_images.json")
IMAGE_SIZE        = (400, 400)       # final saved image dimensions
REQUEST_DELAY     = (1.5, 3.0)       # random sleep range between requests (seconds)
MAX_RETRIES       = 2
LOG_FILE          = "download_log.txt"

GOOGLE_API_KEY    = os.environ.get("GOOGLE_API_KEY", "")
GOOGLE_CSE_ID     = os.environ.get("GOOGLE_CSE_ID", "")

# Type → background colour for placeholder avatars
TYPE_COLORS = {
    "elite":   ("#1a1a2e", "#e94560"),   # dark navy / red accent
    "flow":    ("#0f3460", "#16213e"),   # deep blue gradient simulation
    "passive": ("#2d3436", "#636e72"),   # charcoal / grey
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

# ── Logging ─────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger(__name__)

# ── Helpers ─────────────────────────────────────────────────────────────────

def sanitize_filename(name: str) -> str:
    """Convert a person name to a safe filename (keeps spaces → underscores)."""
    safe = re.sub(r'[\\/*?:"<>|]', "", name)
    return safe.strip()


def sleep_random():
    time.sleep(random.uniform(*REQUEST_DELAY))


def download_image(url: str, min_size: int = 60) -> Image.Image | None:
    """Download an image from a URL and return a PIL Image, or None on failure."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15, stream=True)
        resp.raise_for_status()
        content_type = resp.headers.get("Content-Type", "")
        if "image" not in content_type and "octet-stream" not in content_type:
            log.debug(f"  Non-image content-type: {content_type}")
            return None
        img = Image.open(BytesIO(resp.content)).convert("RGB")
        w, h = img.size
        if w < min_size or h < min_size:
            log.debug(f"  Image too small ({w}x{h}), skipping.")
            return None
        return img
    except Exception as e:
        log.debug(f"  Download failed ({url}): {e}")
        return None


def save_image(img: Image.Image, path: Path):
    """Resize and save image to disk as JPEG."""
    img = img.resize(IMAGE_SIZE, Image.LANCZOS)
    img.save(path, "JPEG", quality=90)


def make_placeholder(name: str, investor_type: str) -> Image.Image:
    """Generate a clean initials-based avatar as fallback."""
    bg_color, accent = TYPE_COLORS.get(investor_type, ("#2d3436", "#636e72"))

    img = Image.new("RGB", IMAGE_SIZE, bg_color)
    draw = ImageDraw.Draw(img)

    # Draw accent circle
    margin = 40
    draw.ellipse(
        [margin, margin, IMAGE_SIZE[0] - margin, IMAGE_SIZE[1] - margin],
        outline=accent,
        width=6,
    )

    # Initials
    initials = "".join(w[0].upper() for w in name.split() if w and w[0].isalpha())[:2]
    try:
        # Try to use a system font
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 120)
    except Exception:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), initials, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (IMAGE_SIZE[0] - text_w) // 2
    y = (IMAGE_SIZE[1] - text_h) // 2 - 10
    draw.text((x, y), initials, fill=accent, font=font)

    # Name label at bottom
    try:
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
    except Exception:
        small_font = ImageFont.load_default()

    short_name = name if len(name) <= 22 else name.split()[0] + " " + name.split()[-1]
    nb = draw.textbbox((0, 0), short_name, font=small_font)
    nw = nb[2] - nb[0]
    draw.text(((IMAGE_SIZE[0] - nw) // 2, IMAGE_SIZE[1] - 55), short_name, fill="#cccccc", font=small_font)

    return img


# ── Image Sources ────────────────────────────────────────────────────────────

def try_wikipedia(name: str) -> Image.Image | None:
    """Fetch the lead image from the Wikipedia article for this person."""
    if not WIKI_AVAILABLE or not BS4_AVAILABLE:
        return None
    try:
        wiki = wikipediaapi.Wikipedia(
            language="en",
            user_agent="InvestorImageDownloader/1.0 (private research script)"
        )
        page = wiki.page(name)
        if not page.exists():
            # Try name variants
            for variant in [
                name.replace(".", ""),
                name.split()[0] + " " + name.split()[-1],
                name + " (investor)",
                name + " (businessman)",
            ]:
                page = wiki.page(variant)
                if page.exists():
                    break
            else:
                log.debug(f"  Wikipedia: no page found for '{name}'")
                return None

        # Scrape the actual Wikipedia page for the infobox image
        wiki_url = f"https://en.wikipedia.org/wiki/{page.title.replace(' ', '_')}"
        resp = requests.get(wiki_url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        # Look for infobox image
        infobox = soup.find("table", class_=re.compile(r"infobox"))
        if infobox:
            img_tag = infobox.find("img")
            if img_tag and img_tag.get("src"):
                src = img_tag["src"]
                if src.startswith("//"):
                    src = "https:" + src
                # Get higher resolution version
                src = re.sub(r"/\d+px-", "/400px-", src)
                img = download_image(src)
                if img:
                    log.info(f"  ✓ Wikipedia infobox → {name}")
                    return img

        log.debug(f"  Wikipedia: page exists but no infobox image for '{name}'")
        return None
    except Exception as e:
        log.debug(f"  Wikipedia error for '{name}': {e}")
        return None


def try_duckduckgo(name: str, firm: str = "") -> Image.Image | None:
    """Search DuckDuckGo images and return the first suitable result."""
    if not DDG_AVAILABLE:
        return None
    queries = [
        f"{name} investor India headshot",
        f"{name} {firm} photo",
        f"{name} venture capital India",
        f"{name} entrepreneur India",
    ]
    try:
        with DDGS() as ddgs:
            for query in queries:
                sleep_random()
                results = list(ddgs.images(
                    query,
                    max_results=5,
                    size="Medium",
                    type_image="photo",
                    layout="Square",
                ))
                for r in results:
                    url = r.get("image", "")
                    if not url:
                        continue
                    # Skip stock photo / generic sites
                    if any(bad in url for bad in ["shutterstock", "getty", "alamy", "istockphoto", "pravatar"]):
                        continue
                    img = download_image(url, min_size=100)
                    if img:
                        log.info(f"  ✓ DuckDuckGo ({query[:40]}) → {name}")
                        return img
    except Exception as e:
        log.debug(f"  DuckDuckGo error for '{name}': {e}")
    return None


def try_google_custom_search(name: str, firm: str = "") -> Image.Image | None:
    """Use Google Custom Search API for image search (requires API key + CSE ID)."""
    if not GOOGLE_API_KEY or not GOOGLE_CSE_ID:
        return None
    query = f"{name} {firm} investor India"
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": GOOGLE_API_KEY,
        "cx": GOOGLE_CSE_ID,
        "q": query,
        "searchType": "image",
        "imgType": "face",
        "imgSize": "medium",
        "num": 5,
    }
    try:
        resp = requests.get(url, params=params, timeout=15)
        resp.raise_for_status()
        items = resp.json().get("items", [])
        for item in items:
            img_url = item.get("link", "")
            if not img_url:
                continue
            img = download_image(img_url, min_size=100)
            if img:
                log.info(f"  ✓ Google CSE → {name}")
                return img
    except Exception as e:
        log.debug(f"  Google CSE error for '{name}': {e}")
    return None


def try_linkedin_avatar(name: str) -> Image.Image | None:
    """
    Attempt to fetch avatar via unavatar.io (aggregates LinkedIn, Twitter, etc.)
    Works for names that have a clear social media presence.
    """
    # unavatar uses Twitter/X handles — works best for names that match handles
    slug = name.lower().replace(" ", "").replace(".", "")
    url = f"https://unavatar.io/twitter/{slug}?fallback=false"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code == 200 and "image" in resp.headers.get("Content-Type", ""):
            img = Image.open(BytesIO(resp.content)).convert("RGB")
            if img.size[0] >= 60:
                log.info(f"  ✓ unavatar.io (Twitter) → {name}")
                return img
    except Exception as e:
        log.debug(f"  unavatar error for '{name}': {e}")
    return None


# ── Main downloader ──────────────────────────────────────────────────────────

def download_for_person(name: str, firm: str, investor_type: str, output_dir: Path) -> str:
    """
    Try all image sources in order, fall back to placeholder.
    Returns the final image file path (relative).
    """
    safe_name = sanitize_filename(name)
    out_path = output_dir / f"{safe_name}.jpg"

    if out_path.exists():
        log.info(f"  ⏭  Already exists, skipping: {safe_name}.jpg")
        return str(out_path)

    log.info(f"\n{'─'*60}")
    log.info(f"  Processing: {name} ({firm})")

    img = None

    # Source 1: Wikipedia (most authoritative)
    img = try_wikipedia(name)
    sleep_random()

    # Source 2: DuckDuckGo image search
    if img is None:
        img = try_duckduckgo(name, firm)
        sleep_random()

    # Source 3: Google Custom Search API (if configured)
    if img is None:
        img = try_google_custom_search(name, firm)
        sleep_random()

    # Source 4: unavatar (social handle guess)
    if img is None:
        img = try_linkedin_avatar(name)

    # Source 5: Placeholder avatar
    if img is None:
        log.warning(f"  ⚠  All sources failed — generating placeholder for: {name}")
        img = make_placeholder(name, investor_type)

    save_image(img, out_path)
    log.info(f"  💾 Saved → {out_path}")
    return str(out_path)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if not JSON_INPUT.exists():
        log.error(f"Input JSON not found: {JSON_INPUT}")
        log.error("Place indian_investors.json in the same directory as this script.")
        return

    with open(JSON_INPUT, encoding="utf-8") as f:
        investors = json.load(f)

    log.info(f"Loaded {len(investors)} investors from {JSON_INPUT}")
    log.info(f"Images will be saved to: {OUTPUT_DIR.resolve()}\n")

    results = {}
    total = len(investors)

    for i, investor in enumerate(investors, 1):
        name  = investor["name"]
        firm  = investor.get("firm", "")
        itype = investor.get("type", "passive")

        log.info(f"[{i}/{total}]")

        path = download_for_person(name, firm, itype, OUTPUT_DIR)
        results[name] = path

        # Update image field in investor data (relative path for portability)
        investor["image"] = f"./investor_images/{sanitize_filename(name)}.jpg"

    # Write updated JSON
    with open(JSON_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(investors, f, indent=2, ensure_ascii=False)

    log.info(f"\n{'='*60}")
    log.info(f"✅  Done! {len(results)} images processed.")
    log.info(f"📁  Images folder : {OUTPUT_DIR.resolve()}")
    log.info(f"📄  Updated JSON  : {JSON_OUTPUT.resolve()}")
    log.info(f"📋  Full log      : {Path(LOG_FILE).resolve()}")

    # Print summary
    ok       = sum(1 for p in results.values() if OUTPUT_DIR / (Path(p).name) in OUTPUT_DIR.iterdir())
    log.info(f"\n{'─'*60}")
    log.info("SUMMARY")
    log.info(f"  Total processed : {total}")
    log.info(f"  Saved           : {len(results)}")
    log.info("Run again any time — already-downloaded images are skipped.")


if __name__ == "__main__":
    main()