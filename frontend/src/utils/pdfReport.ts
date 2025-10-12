import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { GoatStats } from '../types/index';

export const generateDashboardReport = (stats: GoatStats, userName: string) => {
  const doc = new jsPDF();
  
  // Configuración
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // ==========================================
  // HEADER CON LOGO
  // ==========================================
  doc.setFillColor(34, 197, 94); // green-600
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SISTEMA CAPRI', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Reporte de Gestion Caprina', pageWidth / 2, 28, { align: 'center' });
  
  yPos = 50;

  // ==========================================
  // INFORMACIÓN DEL REPORTE
  // ==========================================
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  doc.text(`Fecha de generación: ${currentDate}`, 15, yPos);
  yPos += 6;
  doc.text(`Generado por: ${userName}`, 15, yPos);
  yPos += 15;

  // ==========================================
  // RESUMEN EJECUTIVO
  // ==========================================
  doc.setFillColor(243, 244, 246); // gray-100
  doc.rect(10, yPos - 5, pageWidth - 20, 10, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 163, 74); // green-600
  doc.text('RESUMEN EJECUTIVO', 15, yPos);
  yPos += 15;

  // Estadísticas principales en tabla
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const summaryData = [
    ['Métrica', 'Valor', 'Descripción'],
    ['Total de Cabras', stats.total.toString(), 'Animales registrados en el sistema'],
    ['Producción de Leche', `${stats.totalMilkProduction.toFixed(1)} L`, 'Producción total acumulada'],
    ['Machos', stats.bySex.find(s => s.sex === 'MALE')?._count.toString() || '0', 'Reproductores'],
    ['Hembras', stats.bySex.find(s => s.sex === 'FEMALE')?._count.toString() || '0', 'Productoras'],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    theme: 'grid',
    headStyles: { 
      fillColor: [34, 197, 94], // green-600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0]
    },
    alternateRowStyles: {
      fillColor: [243, 244, 246] // gray-100
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { halign: 'center', cellWidth: 30, fontStyle: 'bold', textColor: [22, 163, 74] },
      2: { cellWidth: 'auto' }
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // ==========================================
  // DISTRIBUCIÓN POR CATEGORÍA
  // ==========================================
  doc.setFillColor(243, 244, 246);
  doc.rect(10, yPos - 5, pageWidth - 20, 10, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(147, 51, 234); // purple-600
  doc.text('DISTRIBUCION POR CATEGORIA', 15, yPos);
  yPos += 15;

    // Tabla de categorías
  const categoryData = [
    ['Categoría', 'Cantidad', 'Porcentaje']
  ];

  stats.byCategory.forEach(cat => {
    const percentage = stats.total > 0 ? ((cat._count / stats.total) * 100).toFixed(1) : '0';
    
    categoryData.push([
      cat.category,
      cat._count.toString(),
      `${percentage}%`
    ]);
  });

  autoTable(doc, {
    startY: yPos,
    head: [categoryData[0]],
    body: categoryData.slice(1),
    theme: 'striped',
    headStyles: { 
      fillColor: [147, 51, 234], // purple-600
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold' },
      1: { halign: 'center', cellWidth: 30, fontStyle: 'bold', textColor: [147, 51, 234] },
      2: { halign: 'center', cellWidth: 30 }
    },
    alternateRowStyles: {
      fillColor: [250, 245, 255] // purple-50
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Gráfico de barras para categorías
  doc.setFontSize(10);
  const categoryBarHeight = 12;
  const categoryBarMaxWidth = pageWidth - 100;

  stats.byCategory.forEach((cat) => {
    const percentage = stats.total > 0 ? (cat._count / stats.total) : 0;
    const barWidth = percentage * categoryBarMaxWidth;
    
    // Nombre de categoría
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(cat.category, 15, yPos + 8);
    
    // Barra
    doc.setFillColor(147, 51, 234); // purple-500
    doc.rect(50, yPos, barWidth, categoryBarHeight, 'F');
    doc.setDrawColor(147, 51, 234);
    doc.rect(50, yPos, categoryBarMaxWidth, categoryBarHeight);
    
    // Valor
    doc.setFont('helvetica', 'bold');
    doc.text(`${cat._count} (${(percentage * 100).toFixed(1)}%)`, 50 + categoryBarMaxWidth + 5, yPos + 8);
    
    yPos += categoryBarHeight + 8;
  });

  yPos += 10;

  // Si hay espacio, agregar distribución por raza, sino nueva página
  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = 20;
  }

  // ==========================================
  // DISTRIBUCIÓN POR RAZA
  // ==========================================
  doc.setFillColor(243, 244, 246);
  doc.rect(10, yPos - 5, pageWidth - 20, 10, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 184, 166); // teal-600
  doc.text('DISTRIBUCION POR RAZA', 15, yPos);
  yPos += 15;

  // Tabla de razas
  const breedData = [
    ['Raza', 'Cantidad', 'Porcentaje']
  ];

  stats.byBreed.forEach(breed => {
    const percentage = stats.total > 0 ? ((breed._count / stats.total) * 100).toFixed(1) : '0';
    
    breedData.push([
      breed.breed,
      breed._count.toString(),
      `${percentage}%`
    ]);
  });

  autoTable(doc, {
    startY: yPos,
    head: [breedData[0]],
    body: breedData.slice(1),
    theme: 'striped',
    headStyles: { 
      fillColor: [20, 184, 166], // teal-600
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold' },
      1: { halign: 'center', cellWidth: 30, fontStyle: 'bold', textColor: [20, 184, 166] },
      2: { halign: 'center', cellWidth: 30 }
    },
    alternateRowStyles: {
      fillColor: [240, 253, 250] // teal-50
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Gráfico de barras para razas
  doc.setFontSize(10);
  const breedBarHeight = 12;
  const breedBarMaxWidth = pageWidth - 100;

  stats.byBreed.forEach((breed) => {
    const percentage = stats.total > 0 ? (breed._count / stats.total) : 0;
    const barWidth = percentage * breedBarMaxWidth;
    
    // Nombre de raza
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(breed.breed, 15, yPos + 8);
    
    // Barra
    doc.setFillColor(20, 184, 166); // teal-500
    doc.rect(50, yPos, barWidth, breedBarHeight, 'F');
    doc.setDrawColor(20, 184, 166);
    doc.rect(50, yPos, breedBarMaxWidth, breedBarHeight);
    
    // Valor
    doc.setFont('helvetica', 'bold');
    doc.text(`${breed._count} (${(percentage * 100).toFixed(1)}%)`, 50 + breedBarMaxWidth + 5, yPos + 8);
    
    yPos += breedBarHeight + 8;
  });

  yPos += 10;

  // ==========================================
  // DISTRIBUCIÓN POR SEXO (GRÁFICO DE TEXTO)
  // ==========================================
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(243, 244, 246);
  doc.rect(10, yPos - 5, pageWidth - 20, 10, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246); // blue-600
  doc.text('DISTRIBUCION POR SEXO', 15, yPos);
  yPos += 15;

  const maleCount = stats.bySex.find(s => s.sex === 'MALE')?._count || 0;
  const femaleCount = stats.bySex.find(s => s.sex === 'FEMALE')?._count || 0;
  const malePercentage = stats.total > 0 ? ((maleCount / stats.total) * 100).toFixed(1) : '0';
  const femalePercentage = stats.total > 0 ? ((femaleCount / stats.total) * 100).toFixed(1) : '0';

  // Gráfico visual de barras horizontales
  const barHeight = 15;
  const barMaxWidth = pageWidth - 100;
  
  // Machos
  doc.setFillColor(99, 102, 241); // indigo-500
  const maleBarWidth = stats.total > 0 ? (maleCount / stats.total) * barMaxWidth : 0;
  doc.rect(50, yPos, maleBarWidth, barHeight, 'F');
  doc.setDrawColor(99, 102, 241);
  doc.rect(50, yPos, barMaxWidth, barHeight);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Machos', 15, yPos + 10);
  doc.setFont('helvetica', 'bold');
  doc.text(`${maleCount} (${malePercentage}%)`, 50 + barMaxWidth + 5, yPos + 10);
  
  yPos += barHeight + 10;
  
  // Hembras
  doc.setFont('helvetica', 'normal');
  doc.setFillColor(236, 72, 153); // pink-500
  const femaleBarWidth = stats.total > 0 ? (femaleCount / stats.total) * barMaxWidth : 0;
  doc.rect(50, yPos, femaleBarWidth, barHeight, 'F');
  doc.setDrawColor(236, 72, 153);
  doc.rect(50, yPos, barMaxWidth, barHeight);
  
  doc.setTextColor(0, 0, 0);
  doc.text('Hembras', 15, yPos + 10);
  doc.setFont('helvetica', 'bold');
  doc.text(`${femaleCount} (${femalePercentage}%)`, 50 + barMaxWidth + 5, yPos + 10);

  yPos += 30;

  // ==========================================
  // ANÁLISIS Y RECOMENDACIONES
  // ==========================================
  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(254, 243, 199); // yellow-100
  doc.rect(10, yPos - 5, pageWidth - 20, 10, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(234, 179, 8); // yellow-600
  doc.text('ANALISIS Y OBSERVACIONES', 15, yPos);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  const observations = [];
  
  // Análisis de balance de sexos
  if (stats.total > 0) {
    const ratio = femaleCount > 0 ? (maleCount / femaleCount).toFixed(2) : 'N/A';
    observations.push(`- Ratio Machos/Hembras: ${ratio} (Recomendado: 0.05-0.1 para reproduccion)`);
    
    if (maleCount / stats.total > 0.2) {
      observations.push(`- ALERTA: Alta proporcion de machos (${malePercentage}%). Considere ajustar para optimizar produccion.`);
    }
  }

  // Análisis de producción
  if (femaleCount > 0) {
    const avgProduction = stats.totalMilkProduction / femaleCount;
    observations.push(`- Produccion promedio por hembra: ${avgProduction.toFixed(2)} L`);
  }

  // Análisis de diversidad de razas
  observations.push(`- Diversidad genetica: ${stats.byBreed.length} razas diferentes registradas`);
  
  if (stats.byBreed.length === 1) {
    observations.push(`- RECOMENDACION: Diversificar razas para mejorar la genetica del rebano.`);
  }

  // Análisis de categorías
  const totalAdult = stats.byCategory.filter(c => 
    c.category.includes('ADULT') || c.category.includes('REPRODUCTOR')
  ).reduce((sum, c) => sum + c._count, 0);
  
  const adultPercentage = stats.total > 0 ? ((totalAdult / stats.total) * 100).toFixed(1) : '0';
  observations.push(`- Animales adultos/reproductores: ${adultPercentage}% del total`);

  observations.forEach((obs) => {
    const lines = doc.splitTextToSize(obs, pageWidth - 30);
    doc.text(lines, 15, yPos);
    yPos += lines.length * 5 + 2;
  });

  // ==========================================
  // FOOTER
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.setFont('helvetica', 'italic');
    
    // Footer text
    doc.text(
      `Sistema CAPRI v1.0 | Generado el ${currentDate}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    
    // Page number
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth - 20,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  // ==========================================
  // GUARDAR PDF
  // ==========================================
  const fileName = `reporte-capri-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
