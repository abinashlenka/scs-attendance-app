import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = async (data: any) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance Report');

  worksheet.columns = [
    { header: 'Roll No', key: 'roll', width: 15 },
    { header: 'Student Name', key: 'name', width: 35 },
    { header: 'Attended', key: 'att', width: 12 },
    { header: 'Percentage', key: 'perc', width: 15 },
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF761E14' } };
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
  });

  data.students.forEach((s: any) => {
    const perc = (s.attended / (data.totalClasses || 14)) * 100;
    const row = worksheet.addRow({
      roll: s.rollNo,
      name: s.name,
      att: s.attended,
      perc: `${perc.toFixed(0)}%`,
    });

    if (perc < 75) {
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCCCC' } };
      });
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `SCS_Attendance_${new Date().toLocaleDateString()}.xlsx`);
};