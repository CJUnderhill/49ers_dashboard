export const saveAsCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    alert("No data available to download!");
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]).join(",");

  // Map rows to CSV string
  const rows = data.map((row) =>
    Object.values(row)
      .map((value) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {

          // Handle Record<string, any> type by converting to JSON string
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        } else {
          // Handle other types
          return `"${String(value).replace(/"/g, '""')}"`;
        }
      })
      .join(",")
  ).join("\n");

  // Combine headers and rows
  const csvContent = `${headers}\n${rows}`;

  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
