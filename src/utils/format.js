export function formatDate(dateTime) {
  if (!dateTime) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateTime));
}

export function compactNumber(value) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value || 0);
}
