/**
 * Secure Excel utilities using exceljs (replaces vulnerable xlsx package)
 * This module provides secure Excel read/write operations
 */
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export interface ExcelExportOptions {
  fileName?: string;
  sheetName?: string;
  data: Record<string, unknown>[];
  columns?: string[];
  title?: string;
}

export interface ExcelReadResult {
  data: Record<string, unknown>[];
  headers: string[];
  sheetName: string;
}

/**
 * Securely export data to Excel file
 */
export async function exportToExcelSecure(options: ExcelExportOptions): Promise<void> {
  const {
    fileName = `export_${format(new Date(), 'yyyy-MM-dd_HHmmss')}`,
    sheetName = 'Données',
    data,
    columns,
    title
  } = options;

  if (!data || data.length === 0) {
    throw new Error('Aucune donnée à exporter');
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'MboaSMS';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName);

  // Filter columns if specified
  let exportData = data;
  if (columns && columns.length > 0) {
    exportData = data.map(row => {
      const filteredRow: Record<string, unknown> = {};
      columns.forEach(col => {
        if (col in row) {
          filteredRow[col] = row[col];
        }
      });
      return filteredRow;
    });
  }

  // Get headers from first data row
  const headers = Object.keys(exportData[0] || {});

  let startRow = 1;

  // Add title if provided
  if (title) {
    worksheet.mergeCells(1, 1, 1, headers.length);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.value = title;
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    startRow = 3;
  }

  // Add headers
  const headerRow = worksheet.getRow(startRow);
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
  });

  // Add data rows
  exportData.forEach((row, rowIndex) => {
    const dataRow = worksheet.getRow(startRow + 1 + rowIndex);
    headers.forEach((header, colIndex) => {
      dataRow.getCell(colIndex + 1).value = row[header] as ExcelJS.CellValue;
    });
  });

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    column.width = 15;
  });

  // Generate file and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob, `${fileName}.xlsx`);
}

/**
 * Securely read Excel file
 */
export async function readExcelSecure(file: File): Promise<ExcelReadResult> {
  const workbook = new ExcelJS.Workbook();
  const arrayBuffer = await file.arrayBuffer();
  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('No worksheet found in file');
  }

  const headers: string[] = [];
  const data: Record<string, unknown>[] = [];

  // Get headers from first row
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell, colNumber) => {
    headers[colNumber - 1] = String(cell.value || `Column${colNumber}`);
  });

  // Get data from remaining rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    const rowData: Record<string, unknown> = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber - 1];
      if (header) {
        rowData[header] = cell.value;
      }
    });

    // Only add non-empty rows
    if (Object.keys(rowData).length > 0) {
      data.push(rowData);
    }
  });

  return {
    data,
    headers,
    sheetName: worksheet.name
  };
}

/**
 * Securely read CSV content from Excel file
 * Returns array of arrays for simple parsing
 */
export async function readExcelAsArrays(file: File): Promise<unknown[][]> {
  const workbook = new ExcelJS.Workbook();
  const arrayBuffer = await file.arrayBuffer();

  // Check file extension
  const isCSV = file.name.toLowerCase().endsWith('.csv');

  if (isCSV) {
    // Read as CSV
    const text = await file.text();
    return text.split('\n').map(line =>
      line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
    );
  }

  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('No worksheet found in file');
  }

  const result: unknown[][] = [];

  worksheet.eachRow((row) => {
    const rowData: unknown[] = [];
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      rowData[colNumber - 1] = cell.value;
    });
    result.push(rowData);
  });

  return result;
}

/**
 * Find column index that likely contains phone numbers
 */
export function findPhoneColumn(headers: string[]): number {
  const phonePatterns = [
    /^phone$/i,
    /^tel$/i,
    /^telephone$/i,
    /^téléphone$/i,
    /^mobile$/i,
    /^numero$/i,
    /^numéro$/i,
    /^num$/i,
    /^cell$/i,
    /^contact$/i,
    /phone/i,
    /tel/i,
  ];

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toLowerCase().trim();
    if (phonePatterns.some(pattern => pattern.test(header))) {
      return i;
    }
  }

  return -1;
}
