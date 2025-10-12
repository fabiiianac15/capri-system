import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Sale } from '../services/sale.service';

export const generateSalesReport = (sales: Sale[], userName: string, startDate?: string, endDate?: string) => {
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
  doc.text('Reporte de Ventas', pageWidth / 2, 28, { align: 'center' });
  
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
  
  if (startDate && endDate) {
    doc.text(`Periodo: ${new Date(startDate).toLocaleDateString('es-CO')} - ${new Date(endDate).toLocaleDateString('es-CO')}`, 15, yPos);
    yPos += 6;
  }
  
  doc.text(`Total de ventas: ${sales.length}`, 15, yPos);
  yPos += 15;

  // ==========================================
  // RESUMEN FINANCIERO
  // ==========================================
  doc.setFillColor(243, 244, 246);
  doc.rect(10, yPos - 5, pageWidth - 20, 10, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 163, 74);
  doc.text('RESUMEN FINANCIERO', 15, yPos);
  yPos += 15;

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const avgSale = sales.length > 0 ? totalRevenue / sales.length : 0;
  const paidSales = sales.filter(s => s.paymentStatus === 'PAID').length;
  const pendingSales = sales.filter(s => s.paymentStatus === 'PENDING').length;
  const partialSales = sales.filter(s => s.paymentStatus === 'PARTIAL').length;

  const summaryData = [
    ['Metrica', 'Valor'],
    ['Total Ventas', sales.length.toString()],
    ['Pagadas', paidSales.toString()],
    ['Pendientes', pendingSales.toString()],
    ['Parciales', partialSales.toString()],
    ['Ingresos Totales', `$${totalRevenue.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`],
    ['Promedio por Venta', `$${avgSale.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`],
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
      1: { halign: 'right', fontStyle: 'bold', textColor: [22, 163, 74], cellWidth: 'auto' }
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // ==========================================
  // TABLA DETALLADA DE VENTAS
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
  doc.text('DETALLE DE VENTAS', 15, yPos);
  yPos += 15;

  const salesData = [
    ['Fecha', 'Cliente', 'Producto', 'Cantidad', 'Total', 'Estado']
  ];

  sales.forEach(sale => {
    const date = new Date(sale.saleDate).toLocaleDateString('es-CO');
    const status = sale.paymentStatus === 'PAID' ? 'Pagada' : 
                   sale.paymentStatus === 'PENDING' ? 'Pendiente' : 'Parcial';
    const productName = sale.productType === 'CARNE' ? 'Carne' :
                        sale.productType === 'LECHE' ? 'Leche' : 'Cabra Viva';
    
    salesData.push([
      date,
      sale.customerName,
      productName,
      `${sale.quantity} ${sale.unit}`,
      `$${sale.totalPrice.toLocaleString('es-CO')}`,
      status
    ]);
  });

  autoTable(doc, {
    startY: yPos,
    head: [salesData[0]],
    body: salesData.slice(1),
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
      0: { cellWidth: 25 },
      1: { cellWidth: 40 },
      2: { cellWidth: 45 },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
      5: { cellWidth: 'auto', halign: 'center' }
    },
    alternateRowStyles: {
      fillColor: [240, 249, 255]
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // ==========================================
  // VENTAS POR PRODUCTO
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
  doc.text('RESUMEN POR PRODUCTO', 15, yPos);
  yPos += 15;

  const productGroups = sales.reduce((acc, sale) => {
    const productName = sale.productType === 'CARNE' ? 'Carne' :
                        sale.productType === 'LECHE' ? 'Leche' : 'Cabra Viva';
    
    if (!acc[productName]) {
      acc[productName] = { count: 0, quantity: 0, revenue: 0 };
    }
    acc[productName].count++;
    acc[productName].quantity += sale.quantity;
    acc[productName].revenue += sale.totalPrice;
    return acc;
  }, {} as Record<string, { count: number; quantity: number; revenue: number }>);

  const productData = [
    ['Producto', 'N° Ventas', 'Cantidad Total', 'Ingresos', '% Ingresos']
  ];

  Object.entries(productGroups)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .forEach(([product, data]) => {
      const percentage = totalRevenue > 0 ? ((data.revenue / totalRevenue) * 100).toFixed(1) : '0.0';
      
      productData.push([
        product,
        data.count.toString(),
        data.quantity.toString(),
        `$${data.revenue.toLocaleString('es-CO')}`,
        `${percentage}%`
      ]);
    });

  autoTable(doc, {
    startY: yPos,
    head: [productData[0]],
    body: productData.slice(1),
    theme: 'grid',
    headStyles: { 
      fillColor: [147, 51, 234],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 70 },
      1: { halign: 'center', cellWidth: 25 },
      2: { halign: 'center', cellWidth: 30 },
      3: { halign: 'right', fontStyle: 'bold', textColor: [147, 51, 234], cellWidth: 35 },
      4: { halign: 'center', cellWidth: 'auto' }
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // ==========================================
  // ANÁLISIS
  // ==========================================
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(254, 243, 199);
  doc.rect(10, yPos - 5, pageWidth - 20, 10, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(234, 179, 8);
  doc.text('ANALISIS', 15, yPos);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  const observations = [];
  
  const topProduct = Object.entries(productGroups).sort((a, b) => b[1].revenue - a[1].revenue)[0];
  if (topProduct) {
    observations.push(`- Producto mas vendido: ${topProduct[0]} (${topProduct[1].count} ventas, $${topProduct[1].revenue.toLocaleString('es-CO')})`);
  }

  if (pendingSales > 0) {
    const pendingRevenue = sales
      .filter(s => s.paymentStatus === 'PENDING')
      .reduce((sum, s) => sum + s.totalPrice, 0);
    observations.push(`- Ventas pendientes: ${pendingSales} (Valor: $${pendingRevenue.toLocaleString('es-CO')})`);
  }

  const paymentRate = sales.length > 0 ? ((paidSales / sales.length) * 100).toFixed(1) : '0';
  observations.push(`- Tasa de pago completo: ${paymentRate}%`);

  observations.forEach((obs) => {
    const lines = doc.splitTextToSize(obs, pageWidth - 30);
    doc.text(lines, 15, yPos);
    yPos += lines.length * 5 + 2;
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
      `Sistema CAPRI v1.0 | Reporte de Ventas | ${currentDate}`,
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
  const fileName = `reporte-ventas-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
