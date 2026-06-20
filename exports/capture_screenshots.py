# -*- coding: utf-8 -*-
"""Скриншоты Hotel Analytics Pro для отчёта ДЗ-1 (часть 2)."""
from __future__ import annotations

import re
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "screenshots"
BASE = "http://localhost:5173"
GITHUB = "https://github.com/igrgor/AIKIVAVIORA-Travel-MCP-Workspace"


def wait_ui(page) -> None:
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(800)


def click_text(page, text: str, exact: bool = False) -> None:
    page.get_by_text(text, exact=exact).first.click()
    page.wait_for_timeout(400)


def expand_accordion(page, heading: str) -> None:
    trigger = page.locator("button").filter(has_text=heading).first
    if trigger.count():
        state = trigger.get_attribute("data-state")
        if state != "open":
            trigger.click()
            page.wait_for_timeout(500)


def shot(page, name: str, full_page: bool = False) -> Path:
    path = OUT / name
    page.screenshot(path=str(path), full_page=full_page)
    print("saved", path.name, path.stat().st_size // 1024, "KB")
    return path


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1600, "height": 900},
            locale="ru-RU",
            color_scheme="dark",
        )
        page = context.new_page()

        # 1 — три колонки
        page.goto(BASE, wait_until="networkidle")
        wait_ui(page)
        shot(page, "01_ui_three_columns.png")

        # 2 — каталог / KPI
        page.get_by_role("button").filter(has_text=re.compile(r"24\s*/\s*847")).first.click()
        page.wait_for_timeout(600)
        expand_accordion(page, "Отслеживаемые объекты")
        page.get_by_role("button").filter(has_text=re.compile(r"Все\s*\(847\)")).first.click()
        page.wait_for_timeout(400)
        page.locator("#tracked-hotels").scroll_into_view_if_needed()
        shot(page, "02_kpi_hotels.png", full_page=True)

        # 3 — погода MCP
        expand_accordion(page, "Погода в регионе")
        page.wait_for_timeout(3500)
        page.locator("text=Температура за 30 дней").first.wait_for(timeout=20000)
        page.locator("text=Погода в регионе").first.scroll_into_view_if_needed()
        shot(page, "03_weather_mcp.png", full_page=True)

        # 4 — сравнение
        expand_accordion(page, "Матрица сравнения")
        page.wait_for_timeout(400)
        checkboxes = page.locator('input[type="checkbox"]')
        for i in range(min(3, checkboxes.count())):
            box = checkboxes.nth(i)
            if not box.is_checked():
                box.check(force=True)
        page.wait_for_timeout(600)
        page.locator("#comparison-matrix").scroll_into_view_if_needed()
        shot(page, "04_comparison_matrix.png", full_page=True)

        # 5 — отчёты / список
        page.get_by_role("button").filter(has_text=re.compile(r"в моём списке|0 в моём")).first.click()
        page.wait_for_timeout(300)
        expand_accordion(page, "Исследовательская среда")
        page.wait_for_timeout(400)
        page.locator("#research-workspace").scroll_into_view_if_needed()
        shot(page, "05_watchlist_reports.png", full_page=True)

        # 6 — GitHub
        page.goto(GITHUB, wait_until="networkidle")
        wait_ui(page)
        shot(page, "06_github_repo.png", full_page=True)

        browser.close()

    print("done:", OUT)


if __name__ == "__main__":
    main()
