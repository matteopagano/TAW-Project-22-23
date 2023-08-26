import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import { ItemForTable } from './features/users/cashier/visualize-table-details/visualize-table-details.component';
import * as a from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  generateReceipt(price: number | undefined, items: ItemForTable[]): void {
    const pdf = new jsPDF.jsPDF('p', 'mm', 'a4');
    let yOffset = 10;

    pdf.setFont('Arial', 'normal');

    pdf.setFontSize(18);
    pdf.text('Bill', 10, yOffset);
    yOffset += 10;

    pdf.setLineWidth(0.5);
    pdf.line(10, yOffset, 200, yOffset);
    yOffset += 10;

    const columnHeaders = ['Description', 'Qta.', 'Single Price', 'Total'];

    pdf.setFontSize(12);
    pdf.setFont('bold');
    pdf.text(columnHeaders[0], 15, yOffset);
    pdf.text(columnHeaders[1], 110, yOffset);
    pdf.text(columnHeaders[2], 140, yOffset);
    pdf.text(columnHeaders[3], 170, yOffset);
    yOffset += 12;

    pdf.setLineWidth(0.5);
    yOffset += 2;

    pdf.setFontSize(10);
    pdf.setFont('normal');
    items.forEach((item, index) => {
      const description = item.name;
      const quantity = `x${item.quantity}`;
      const priceSingle = `€${item.price.toFixed(2)}`;
      const totalItem = `€${(item.price * item.quantity).toFixed(2)}`;

      pdf.text(description, 15, yOffset);
      pdf.text(quantity, 110, yOffset);
      pdf.text(priceSingle, 140, yOffset);
      pdf.text(totalItem, 170, yOffset);

      yOffset += 12;
    });

    pdf.setLineWidth(0.5);
    pdf.line(10, yOffset, 200, yOffset);
    yOffset += 10;

    pdf.setFontSize(14);
    if(price)
      pdf.text(`Total: €${price.toFixed(2)}`, 15, yOffset);

    pdf.setFontSize(12);
    pdf.text('Thanks for your presence!', 15, yOffset + 15);

    pdf.save('scontrino.pdf');
  }
}
