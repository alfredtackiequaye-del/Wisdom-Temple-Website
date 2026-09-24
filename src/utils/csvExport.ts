/**
 * Utility to export tabular form data directly to CSV for Excel and Google Sheets
 */
export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string) {
  if (!data || !data.length) {
    alert('No records available to export.');
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(item =>
    headers
      .map(header => {
        let val = item[header] ?? '';
        if (typeof val === 'object') {
          val = JSON.stringify(val);
        }
        const strVal = String(val).replace(/"/g, '""');
        return `"${strVal}"`;
      })
      .join(',')
  );

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
