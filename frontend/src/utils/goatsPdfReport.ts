import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Goat } from '../types/index';

export const generateGoatsReport = (goats: Goat[], userName: string) => {
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // ==========================================
  // HEADER
  // ==========================================
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SISTEMA CAPRI', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Reporte Detallado de Cabras', pageWidth / 2, 28, { align: 'center' });
  
  yPos = 50;

  // ==========================================
  // INFORMACIÓN DEL REPORTE
  // ==========================================
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  doc.text(`Fecha de generacion: ${currentDate}`, 15, yPos);
  yPos += 6;
  doc.text(`Generado por: ${userName}`, 15, yPos);
  yPos += 6;
  doc.text(`Total de registros: ${goats.length}`, 15, yPos);
  yPos += 15;

  // ==========================================
  // RESUMEN RÁPIDO
  // ==========================================
  doc.setFillColor(243, 244, 246);
  doc.rect(10, yPos - 5, pageWidth - 20, 10, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 163, 74);
  doc.text('RESUMEN', 15, yPos);
  yPos += 15;

  const males = goats.filter(g => g.sex === 'MALE').length;
  const females = goats.filter(g => g.sex === 'FEMALE').length;
  const totalMilk = goats.reduce((sum, g) => sum + (g.milkProduction || 0), 0);

  const summaryData = [
    ['Metrica', 'Valor'],
    ['Total de Cabras', goats.length.toString()],
    ['Machos', males.toString()],
    ['Hembras', females.toString()],
    ['Produccion Total de Leche', `${totalMilk.toFixed(1)} L`],
    ['Promedio por Hembra', females > 0 ? `${(totalMilk / females).toFixed(2)} L` : 'N/A'],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    theme: 'grid',
    headStyles: { 
      fillColor: [34, 197, 94],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { halign: 'right', fontStyle: 'bold', textColor: [22, 163, 74] }
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // ==========================================
  // TABLA DETALLADA DE CABRAS
  // ==========================================
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(243, 244, 246);
  doc.rect(10, yPos - 5, pageWidth - 20, 10, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('LISTADO DETALLADO DE CABRAS', 15, yPos);
  yPos += 15;

  const goatsData = [
    ['Nombre', 'Raza', 'Sexo', 'Categoria', 'Edad', 'Prod. Leche']
  ];

  goats.forEach(goat => {
    const age = goat.birthDate 
      ? `${Math.floor((new Date().getTime() - new Date(goat.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} anos`
      : 'N/A';
    
    goatsData.push([
      goat.name || 'Sin nombre',
      goat.breed,
      goat.sex === 'MALE' ? 'Macho' : 'Hembra',
      goat.category,
      age,
      goat.milkProduction ? `${goat.milkProduction} L` : '-'
    ]);
  });

  autoTable(doc, {
    startY: yPos,
    head: [goatsData[0]],
    body: goatsData.slice(1),
    theme: 'striped',
    headStyles: { 
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 30 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30 },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 25, halign: 'right', fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [240, 249, 255]
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // ==========================================
  // ESTADÍSTICAS POR RAZA
  // ==========================================
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(243, 244, 246);
  doc.rect(10, yPos - 5, pageWidth - 20, 10, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(147, 51, 234);
  doc.text('DISTRIBUCION POR RAZA', 15, yPos);
  yPos += 15;

  const breedGroups = goats.reduce((acc, goat) => {
    if (!acc[goat.breed]) {
      acc[goat.breed] = { count: 0, milk: 0 };
    }
    acc[goat.breed].count++;
    acc[goat.breed].milk += goat.milkProduction || 0;
    return acc;
  }, {} as Record<string, { count: number; milk: number }>);

  const breedData = [
    ['Raza', 'Cantidad', 'Porcentaje', 'Prod. Total', 'Promedio']
  ];

  Object.entries(breedGroups).forEach(([breed, data]) => {
    const percentage = ((data.count / goats.length) * 100).toFixed(1);
    const average = data.count > 0 ? (data.milk / data.count).toFixed(2) : '0.00';
    
    breedData.push([
      breed,
      data.count.toString(),
      `${percentage}%`,
      `${data.milk.toFixed(1)} L`,
      `${average} L`
    ]);
  });

  autoTable(doc, {
    startY: yPos,
    head: [breedData[0]],
    body: breedData.slice(1),
    theme: 'grid',
    headStyles: { 
      fillColor: [147, 51, 234],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'center', fontStyle: 'bold', textColor: [147, 51, 234] },
      2: { halign: 'center' },
      3: { halign: 'right', fontStyle: 'bold' },
      4: { halign: 'right' }
    }
  });

  // ==========================================
  // FOOTER EN TODAS LAS PÁGINAS
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.setFont('helvetica', 'italic');
    
    doc.text(
      `Sistema CAPRI v1.0 | Reporte de Cabras | ${currentDate}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    
    doc.text(
      `Pagina ${i} de ${totalPages}`,
      pageWidth - 20,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  // ==========================================
  // GUARDAR PDF
  // ==========================================
  const fileName = `reporte-cabras-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
