import re
from copy import copy
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

USER_AGENT = "WebsiteAuditBot/1.0"
REQUEST_TIMEOUT = 10
EXCERPT_LENGTH = 3000

CTA_TEXT_PATTERNS = (
    "get started",
    "contact",
    "sign up",
    "learn more",
    "buy",
    "download",
    "subscribe",
    "book a demo",
    "request a demo",
    "try free",
    "start free",
)

SKIP_HREF_PREFIXES = ("mailto:", "tel:", "javascript:", "#")


class ScraperError(Exception):
    """Raised when a page cannot be fetched or parsed."""


def fetch_html(url: str) -> tuple[str, str]:
    try:
        response = requests.get(
            url,
            timeout=REQUEST_TIMEOUT,
            headers={"User-Agent": USER_AGENT},
            allow_redirects=True,
        )
        response.raise_for_status()
        return response.text, response.url
    except requests.exceptions.Timeout as exc:
        raise ScraperError(f"Request timed out after {REQUEST_TIMEOUT} seconds") from exc
    except requests.exceptions.ConnectionError as exc:
        raise ScraperError(f"Failed to connect to {url}") from exc
    except requests.exceptions.HTTPError as exc:
        status = exc.response.status_code if exc.response is not None else "unknown"
        raise ScraperError(f"HTTP error {status} when fetching {url}") from exc
    except requests.exceptions.RequestException as exc:
        raise ScraperError(f"Failed to fetch {url}: {exc}") from exc


def _normalize_host(url: str) -> str:
    host = urlparse(url).netloc.lower()
    if host.startswith("www."):
        return host[4:]
    return host


def _clean_soup(soup: BeautifulSoup) -> BeautifulSoup:
    cleaned = copy(soup)
    for tag in cleaned.find_all(["script", "style", "noscript"]):
        tag.decompose()
    return cleaned


def _extract_body_text(soup: BeautifulSoup) -> str:
    cleaned = _clean_soup(soup)
    body = cleaned.find("body")
    text = body.get_text(separator=" ", strip=True) if body else cleaned.get_text(separator=" ", strip=True)
    return re.sub(r"\s+", " ", text).strip()


def _count_words(text: str) -> int:
    if not text:
        return 0
    return len(text.split())


def _count_headings(soup: BeautifulSoup) -> dict:
    return {
        "h1": len(soup.find_all("h1")),
        "h2": len(soup.find_all("h2")),
        "h3": len(soup.find_all("h3")),
    }


def _is_cta_link(anchor) -> bool:
    href = (anchor.get("href") or "").strip()
    if not href or href.startswith(SKIP_HREF_PREFIXES):
        return False

    class_id = " ".join(
        filter(
            None,
            [
                " ".join(anchor.get("class", [])),
                anchor.get("id", ""),
                anchor.get("role", ""),
            ],
        )
    ).lower()

    if "btn" in class_id or "cta" in class_id or "button" in class_id:
        return True

    link_text = anchor.get_text(separator=" ", strip=True).lower()
    return any(pattern in link_text for pattern in CTA_TEXT_PATTERNS)


def _count_ctas(soup: BeautifulSoup) -> int:
    buttons = soup.find_all("button")
    submit_inputs = soup.find_all("input", {"type": "submit"})
    button_inputs = soup.find_all("input", {"type": "button"})
    cta_links = [anchor for anchor in soup.find_all("a") if _is_cta_link(anchor)]
    return len(buttons) + len(submit_inputs) + len(button_inputs) + len(cta_links)


def _classify_links(soup: BeautifulSoup, page_url: str) -> tuple[int, int]:
    page_host = _normalize_host(page_url)
    internal_links = 0
    external_links = 0

    for anchor in soup.find_all("a", href=True):
        href = anchor["href"].strip()
        if not href or href.startswith(SKIP_HREF_PREFIXES):
            continue

        absolute_url = urljoin(page_url, href)
        parsed = urlparse(absolute_url)
        if parsed.scheme not in ("http", "https"):
            continue

        link_host = _normalize_host(absolute_url)
        if link_host == page_host:
            internal_links += 1
        else:
            external_links += 1

    return internal_links, external_links


def _count_images(soup: BeautifulSoup) -> tuple[int, float]:
    images = soup.find_all("img")
    image_count = len(images)
    if image_count == 0:
        return 0, 0.0

    missing_alt = sum(
        1 for img in images if not (img.get("alt") or "").strip()
    )
    missing_pct = round((missing_alt / image_count) * 100, 1)
    return image_count, missing_pct


def _extract_meta(soup: BeautifulSoup) -> tuple[str, str]:
    title_tag = soup.find("title")
    meta_title = title_tag.get_text(strip=True) if title_tag else ""

    description_tag = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
    meta_description = ""
    if description_tag and description_tag.get("content"):
        meta_description = description_tag["content"].strip()

    return meta_title, meta_description


def scrape_page(url: str) -> dict:
    html, final_url = fetch_html(url)
    soup = BeautifulSoup(html, "html.parser")

    body_text = _extract_body_text(soup)
    meta_title, meta_description = _extract_meta(soup)
    internal_links, external_links = _classify_links(soup, final_url)
    image_count, images_missing_alt_pct = _count_images(soup)

    return {
        "url": final_url,
        "metrics": {
            "word_count": _count_words(body_text),
            "headings": _count_headings(soup),
            "cta_count": _count_ctas(soup),
            "internal_links": internal_links,
            "external_links": external_links,
            "image_count": image_count,
            "images_missing_alt_pct": images_missing_alt_pct,
            "meta_title": meta_title,
            "meta_description": meta_description,
        },
        "page_text_excerpt": body_text[:EXCERPT_LENGTH],
    }


if __name__ == "__main__":
    import json
    import sys

    test_urls = sys.argv[1:] or ["https://example.com", "https://www.hubspot.com"]
    for test_url in test_urls:
        print(f"\n=== {test_url} ===")
        try:
            result = scrape_page(test_url)
            print(json.dumps(result, indent=2))
        except ScraperError as error:
            print(f"Error: {error}")
