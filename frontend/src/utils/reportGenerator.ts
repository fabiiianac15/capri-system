import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// ========================================
// TIPOS
// ========================================
export type ExportFormat = 'pdf' | 'excel';

export interface ReportConfig {
  title: string;
  subtitle?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'letter';
}

export interface TableColumn {
  header: string;
  dataKey: string;
  width?: number;
}

// ========================================
// GENERADOR DE PDF
// ========================================
export class PDFReportGenerator {
  private doc: jsPDF;
  private yPosition: number = 20;

  constructor(config: ReportConfig) {
    this.doc = new jsPDF({
      orientation: config.orientation || 'portrait',
      unit: 'mm',
      format: config.pageSize || 'a4'
    });
  }

  addHeader(title: string, subtitle?: string) {
    // Logo o nombre de la empresa
    this.doc.setFontSize(22);
    this.doc.setTextColor(26, 46, 2); // Verde oscuro
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('🐐 CAPRI SYSTEM', 14, this.yPosition);
    
    this.yPosition += 10;
    
    // Título del reporte
    this.doc.setFontSize(16);
    this.doc.setTextColor(34, 197, 94); // Verde
    this.doc.text(title, 14, this.yPosition);
    
    this.yPosition += 7;
    
    if (subtitle) {
      this.doc.setFontSize(11);
      this.doc.setTextColor(100, 100, 100);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(subtitle, 14, this.yPosition);
      this.yPosition += 7;
    }
    
    // Fecha de generación
    this.doc.setFontSize(9);
    this.doc.setTextColor(120, 120, 120);
    const date = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    this.doc.text(`Generado: ${date}`, 14, this.yPosition);
    
    this.yPosition += 10;
    
    // Línea separadora
    this.doc.setDrawColor(34, 197, 94);
    this.doc.setLineWidth(0.5);
    this.doc.line(14, this.yPosition, 196, this.yPosition);
    
    this.yPosition += 7;
  }

  addTable(columns: TableColumn[], data: any[], title?: string) {
    if (title) {
      this.doc.setFontSize(12);
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(title, 14, this.yPosition);
      this.yPosition += 5;
    }

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [columns.map(col => col.header)],
      body: data.map(row => columns.map(col => row[col.dataKey] || '-')),
      theme: 'striped',
      headStyles: {
        fillColor: [34, 197, 94], // Verde
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [240, 253, 244] // Verde muy claro
      },
      columnStyles: columns.reduce((acc, col, index) => {
        if (col.width) {
          acc[index] = { cellWidth: col.width };
        }
        return acc;
      }, {} as any),
      margin: { left: 14, right: 14 }
    });

    // @ts-ignore
    this.yPosition = this.doc.lastAutoTable.finalY + 10;
  }

  addSummaryBox(summaries: { label: string; value: string | number }[]) {
    const boxX = 14;
    const boxY = this.yPosition;
    const boxWidth = 182;
    const boxHeight = 8 + (summaries.length * 7);

    // Fondo del box
    this.doc.setFillColor(240, 253, 244);
    this.doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 2, 2, 'F');

    // Borde
    this.doc.setDrawColor(34, 197, 94);
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 2, 2, 'S');

    // Contenido
    this.doc.setFontSize(10);
    let yPos = boxY + 6;

    summaries.forEach(summary => {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(60, 60, 60);
      this.doc.text(summary.label + ':', boxX + 5, yPos);

      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(22, 163, 74);
      this.doc.text(String(summary.value), boxX + 80, yPos);

      yPos += 7;
    });

    this.yPosition = boxY + boxHeight + 10;
  }

  addPageNumbers() {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setTextColor(120, 120, 120);
      this.doc.text(
        `Página ${i} de ${pageCount}`,
        this.doc.internal.pageSize.getWidth() / 2,
        this.doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
  }

  save(filename: string) {
    this.addPageNumbers();
    this.doc.save(filename);
  }

  download(filename: string) {
    this.save(filename);
  }
}

// ========================================
// GENERADOR DE EXCEL
// ========================================
export class ExcelReportGenerator {
  private workbook: XLSX.WorkBook;
  private worksheets: Map<string, any[][]> = new Map();

  constructor() {
    this.workbook = XLSX.utils.book_new();
  }

  addSheet(sheetName: string, columns: TableColumn[], data: any[], title?: string) {
    const sheetData: any[][] = [];

    // Título (opcional)
    if (title) {
      sheetData.push([title]);
      sheetData.push([]); // Fila vacía
    }

    // Fecha
    sheetData.push([
      'Generado:',
      new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    ]);
    sheetData.push([]); // Fila vacía

    // Encabezados
    sheetData.push(columns.map(col => col.header));

    // Datos
    data.forEach(row => {
      sheetData.push(columns.map(col => row[col.dataKey] || '-'));
    });

    this.worksheets.set(sheetName, sheetData);
  }

  addSummarySheet(sheetName: string, summaries: { label: string; value: string | number }[]) {
    const sheetData: any[][] = [];

    sheetData.push(['RESUMEN DEL REPORTE']);
    sheetData.push([]);
    sheetData.push([
      'Generado:',
      new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    ]);
    sheetData.push([]);

    summaries.forEach(summary => {
      sheetData.push([summary.label, summary.value]);
    });

    this.worksheets.set(sheetName, sheetData);
  }

  save(filename: string) {
    // Crear hojas de trabajo
    this.worksheets.forEach((data, sheetName) => {
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      
      // Ajustar ancho de columnas
      const maxWidth = 50;
      const colWidths = data[0]?.map((_, colIndex) => {
        const maxLength = Math.max(
          ...data.map(row => String(row[colIndex] || '').length)
        );
        return { wch: Math.min(maxLength + 2, maxWidth) };
      });
      worksheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(this.workbook, worksheet, sheetName);
    });

    // Descargar archivo
    XLSX.writeFile(this.workbook, filename);
  }

  download(filename: string) {
    this.save(filename);
  }
}

// ========================================
// FUNCIONES HELPER
// ========================================
export const generateReport = {
  // Formato de fecha
  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-CO');
  },

  // Formato de moneda
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  },

  // Formato de número
  formatNumber(value: number, decimals: number = 2): string {
    return value.toFixed(decimals);
  },

  // Exportar datos simples
  async exportSimpleData(
    format: ExportFormat,
    title: string,
    columns: TableColumn[],
    data: any[],
    filename: string,
    subtitle?: string
  ) {
    if (format === 'pdf') {
      const pdf = new PDFReportGenerator({
        title,
        orientation: columns.length > 5 ? 'landscape' : 'portrait'
      });
      pdf.addHeader(title, subtitle);
      pdf.addTable(columns, data);
      pdf.download(filename);
    } else {
      const excel = new ExcelReportGenerator();
      excel.addSheet('Datos', columns, data, title);
      excel.download(filename);
    }
  }
};
