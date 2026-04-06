import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = async (data: any) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance Report');

  // 1. Setup Columns
  worksheet.columns = [
    { header: 'Roll No', key: 'roll', width: 15 },
    { header: 'Student Name', key: 'name', width: 30 },
    { header: 'Attended', key: 'att', width: 10 },
    { header: 'Percentage', key: 'perc', width: 12 },
    { header: 'Status', key: 'status', width: 15 },
  ];

  // 2. Style the Header Row (Maroon background, White text)
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF761E14' } };
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
  });

  // 3. Add Data & Style Defaulters
  data.students.forEach((s: any) => {
    const perc = (s.attended / (data.totalClasses || 14)) * 100;
    const isDefaulter = perc < 75;
    
    const row = worksheet.addRow({
      roll: s.rollNo,
      name: s.name,
      att: s.attended,
      perc: `${perc.toFixed(0)}%`,
      status: isDefaulter ? 'DEFAULTER' : 'QUALIFIED'
    });

    if (isDefaulter) {
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7C7' } }; // Light Red
      });
    }
  });

  // 4. Generate & Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Attendance_${data.subject || 'Report'}.xlsx`);
};