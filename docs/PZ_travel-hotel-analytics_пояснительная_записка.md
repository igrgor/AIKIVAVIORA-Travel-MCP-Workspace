# AIKIVAVIORA — Пояснительная записка

**AIKIVAVIORA Travel MCP Workspace · Hotel Analytics Pro** · **ПЗ** · v1.1-cursor · Июнь 2026 · Автор: Игорь Кашинцев

---

## История версий

| Версия | Дата | Изменение |
|--------|------|-----------|
| v1.0 | 18.06.2026 | UI Shell MVP на Replit (архив) |
| v1.1 | 18.06.2026 | Cursor: watchlist, отчёты, сравнение, Weather MCP, UX-метки «в разработке» |

---

## 1. Общие сведения

### 1.1. Назначение

Учебный веб-проект для **Школы 6 (MCP для AI-агентов)**, часть 2 ДЗ-1: отельная аналитика вместо стандартного сценария Kiwi + Trivago. Демонстрирует трёхколоночный research-workspace в стиле AIKIVAVIORA.

### 1.2. Цель

Создать рабочую оболочку аналитика отелей с:

- мониторингом объектов (ADR, RevPAR, загрузка);
- сравнением конкурентов;
- исследовательским чатом;
- интеграцией **Weather MCP** (задел ДЗ-2);
- сохранением отчётов и пользовательских списков.

### 1.3. Место в экосистеме AIKIVAVIORA

Путь: `02modules/travel/AIKIVAVIORA_Travel_MCP_Workspace/`  
Связь: параллельно `02modules/research/` (крипто-MCP, часть 1 ДЗ-1, с Replit URL).

### 1.4. Почему GitHub, а не Replit

1. **Replit** — использован для первичной сборки UI Shell (v1.0); результат сохранён в `Hotel-Insight-Hub.zip`.
2. **Лимит Replit** — после сдачи части 1 (крипта) оставшийся API/Agent quota направлен на приоритетные задачи; повторный Publish отелей не выполнялся.
3. **Cursor (локально)** — фазы 1–3 (watchlist, отчёты, сравнение, Weather MCP, UX-метки) сделаны вне Replit; код выгружен в **GitHub** как единственный актуальный источник.
4. **Для сдачи** — вместо `.replit.app` указываем **GitHub** + архив + скрины с `localhost:5173`.

**GitHub:** https://github.com/igrgor/AIKIVAVIORA-Travel-MCP-Workspace

---

## 2. Архитектура

```
Пользователь → React UI (3 панели)
                    ↓
         hotel-analytics (:5173)
                    ↓
              api-server (:3001)
         ┌──────────┴──────────┐
         ↓                     ↓
  Weather MCP (stdio)    stubs: workspace, reports
  @dangahagan/weather-mcp
         ↓
  localStorage (браузер)
  watchlist · comparison · reports
```

### Компоненты

| Слой | Технология |
|------|------------|
| UI | React 19, TypeScript, Tailwind v4, shadcn/ui |
| Состояние | React Context + localStorage |
| API | Express 5, TypeScript |
| MCP | Weather — stdio subprocess |
| Данные отелей | Демо-каталог 24 объекта; STR 847 — целевой объём |
| Deploy | Архив Replit v1.0 + **GitHub** (актуально) + локальный запуск |

---

## 3. Реализовано vs в разработке

### Реализовано

| Критерий | Статус |
|----------|--------|
| 3-панельный UI | ✅ |
| Русский интерфейс | ✅ |
| 24 демо-отеля + фильтры | ✅ |
| Мой список (watchlist) | ✅ |
| Сравнение до 9 отелей | ✅ |
| Сохранённые отчёты (MD) | ✅ |
| Weather MCP + график | ✅ |
| Метки Демо / В разработке | ✅ |
| GitHub | ✅ |

### В разработке (заглушки помечены в UI)

| Критерий | План |
|----------|------|
| Каталог STR 847 | API STR + Postgres |
| DeepSeek / OpenRouter | SSE-чат через api-server |
| STR / HotStats / OTA | Реальные коннекторы |
| PDF-экспорт | Puppeteer |
| Облачная синхронизация | Замена localStorage на API+DB |

---

## 4. Ограничения MVP

- KPI, журнал, источники данных — **демонстрационные** (не ошибка системы).
- Чат использует локальный ассистент по демо-данным, не внешний LLM.
- Отчёты хранятся только в браузере до подключения БД.
- Replit-деплой **не актуален**: v1.0 UI Shell — в `Hotel-Insight-Hub.zip`; доработки v1.1 — только GitHub и локальный запуск (см. §1.4).

---

## 5. Ссылки

| Ресурс | URL / путь |
|--------|------------|
| **GitHub (актуальный код)** | https://github.com/igrgor/AIKIVAVIORA-Travel-MCP-Workspace |
| Replit (live URL) | *отсутствует — см. §1.4* |
| Отчёт для сдачи | `PZ_travel-hotel-analytics_отчёт_для_сдачи.md` |
| Weather MCP | `docs/WEATHER_MCP.md` |
| Архив Replit v1.0 | `Hotel-Insight-Hub.zip` |

---

*Шаблон: AIKIVAVIORA · образец DZ-7 / Bolt Day1 · `Cursor/AIKIVAVIORA_v.3_Cursor/09education/TEMPLATES_LIBRARY.md`*
