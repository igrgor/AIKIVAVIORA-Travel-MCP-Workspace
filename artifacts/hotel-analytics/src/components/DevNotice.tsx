import type { ReactNode } from "react";
import { ru, type DevNoticeKind } from "../i18n/ru";

const kindLabel: Record<DevNoticeKind, string> = {
  demo: ru.demoBadge,
  wip: ru.inDevelopment,
  stub: ru.stubBadge,
  local: ru.localOnlyBadge,
};

export function DevBadge({
  kind = "demo",
  className = "",
  title,
}: {
  kind?: DevNoticeKind;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title ?? ru.devNoticeHint(kind)}
      className={`inline-flex items-center text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border border-amber-500/35 text-amber-400/95 bg-amber-500/10 shrink-0 ${className}`}
    >
      {kindLabel[kind]}
    </span>
  );
}

export function DevBanner({
  children,
  kind = "wip",
  className = "",
}: {
  children: ReactNode;
  kind?: DevNoticeKind;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-2 text-[10px] leading-relaxed border border-amber-500/25 bg-amber-500/5 text-amber-200/85 rounded px-3 py-2 ${className}`}
      role="status"
    >
      <DevBadge kind={kind} />
      <span>{children}</span>
    </div>
  );
}
