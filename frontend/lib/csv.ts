export function downloadCsv(filename: string, rows: Record<string, string | number | boolean>[]) {
  if (!rows.length) return;
  const columns = Object.keys(rows[0]);
  const escape = (value: string | number | boolean) => `"${String(value).replaceAll("\"", "\"\"")}"`;
  const csv = [columns.join(","), ...rows.map((row) => columns.map((column) => escape(row[column])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
