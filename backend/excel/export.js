import XLSX, { write } from 'xlsx';

export default function buildLecturesXlsxBuffer(lectures) {
  const worksheet = XLSX.utils.json_to_sheet(lectures);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lectures');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}