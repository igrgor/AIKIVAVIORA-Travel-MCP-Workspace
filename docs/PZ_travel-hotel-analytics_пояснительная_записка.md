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
Связь: параллельно `02modules/research/` (крипто-MCP, часть 1 ДЗ-1).

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
| Deploy | Replit (архив) + локальная разработка Cursor |

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
- Replit-деплой в архиве; актуальная доработка — локально в Cursor.

---

## 5. Ссылки

| Ресурс | URL / путь |
|--------|------------|
| GitHub | https://github.com/igrgor/AIKIVAVIORA-Travel-MCP-Workspace |
| Отчёт для сдачи | `PZ_travel-hotel-analytics_отчёт_для_сдачи.md` |
| Weather MCP | `docs/WEATHER_MCP.md` |
| Архив Replit | `Hotel-Insight-Hub.zip` |

---

*Шаблон: AIKIVAVIORA · образец DZ-7 / Bolt Day1 · `Cursor/AIKIVAVIORA_v.3_Cursor/09education/TEMPLATES_LIBRARY.md`*
