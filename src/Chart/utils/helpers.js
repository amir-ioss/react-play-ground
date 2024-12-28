export function convertTimestampToDate(timestamp) {
  const date = new Date(timestamp);
  let _date = date.toLocaleString().split(","); // Returns a localized string representation of the date and time

  const options = { weekday: "short", day: "numeric", month: "short", year: "2-digit" };
  let formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

  return { date: formattedDate, time: _date[1] };
}

export function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

const colors = [
  "#e11d48",
  "#db2777",
  "#c026d3",
  "#9333ea",
  "#7c3aed",
  "#4f46e5",
  "#2563eb",
  "#0284c7",
  "#0891b2",
  "#0d9488",
  "#059669",
  "#16a34a",
  "#d97706",
  "#ea580c",
  "#dc2626",
  "#94a3b8",
];
export function getColor(id) {
  return colors[id%16];
}
