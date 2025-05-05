import { Injectable } from '@angular/core';
import { PrayerPairing, PrayerTheme } from '../types/api.types';
// Import jsPDF and autoTable directly
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  constructor() {}

  /**
   * Export prayer pairings to PDF
   */
  exportPairingsToPdf(pairings: PrayerPairing[], title: string = 'Prayer Pairings'): void {
    try {
      console.log('Exporting pairings to PDF:', pairings);

      if (!pairings || pairings.length === 0) {
        console.error('No pairings to export');
        alert('No pairings to export.');
        return;
      }

      // Check if jsPDF is available
      if (typeof jsPDF !== 'function') {
        console.error('jsPDF is not available:', jsPDF);
        alert('PDF library is not properly loaded. Please refresh the page and try again.');
        return;
      }

      console.log('Creating PDF document...');

      // Create a new PDF document
      const doc = new jsPDF();

      console.log('PDF document created:', doc);

      // Add title
      doc.setFontSize(18);
      doc.text(title, 14, 22);

      // Add date
      doc.setFontSize(11);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

      // Prepare table data
      const tableColumn = ["Start Date", "End Date", "Partner", "Theme", "Special"];
      const tableRows: any[] = [];

      pairings.forEach(pairing => {
        try {
          const partnerName = this.getPartnerName(pairing);
          const startDate = new Date(pairing.startDate).toLocaleDateString();
          const endDate = new Date(pairing.endDate).toLocaleDateString();

          tableRows.push([
            startDate,
            endDate,
            partnerName,
            pairing.theme?.title || 'No Theme',
            pairing.isSpecialPairing ? 'Yes' : 'No'
          ]);
        } catch (err) {
          console.error('Error processing pairing:', pairing, err);
        }
      });

      console.log('Table data:', tableRows);

      if (tableRows.length === 0) {
        console.error('No valid pairings to export');
        alert('No valid pairings to export.');
        return;
      }

      console.log('Adding table to document using direct autoTable...');

      // Add table to document using direct autoTable
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 50 },
          3: { cellWidth: 60 },
          4: { cellWidth: 20 }
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });

      console.log('Table added to document');

      // Save the PDF
      const filename = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
      console.log('Saving PDF as:', filename);
      doc.save(filename);
      console.log('PDF saved successfully');
    } catch (error: any) {
      console.error('Error exporting pairings to PDF:', error);
      alert(`Failed to export pairings to PDF: ${error.message || 'Unknown error'}. Please check the console for details.`);
    }
  }

  /**
   * Export prayer themes to PDF
   */
  exportThemesToPdf(themes: PrayerTheme[], title: string = 'Prayer Themes'): void {
    try {
      console.log('Exporting themes to PDF:', themes);

      if (!themes || themes.length === 0) {
        console.error('No themes to export');
        alert('No themes to export.');
        return;
      }

      // Check if jsPDF is available
      if (typeof jsPDF !== 'function') {
        console.error('jsPDF is not available:', jsPDF);
        alert('PDF library is not properly loaded. Please refresh the page and try again.');
        return;
      }

      console.log('Creating PDF document...');

      // Create a new PDF document
      const doc = new jsPDF();

      console.log('PDF document created:', doc);

      // Add title
      doc.setFontSize(18);
      doc.text(title, 14, 22);

      // Add date
      doc.setFontSize(11);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

      // Prepare table data
      const tableColumn = ["Theme", "Description", "Status"];
      const tableRows: any[] = [];

      themes.forEach(theme => {
        tableRows.push([
          theme.title || 'No Title',
          theme.description || 'No Description',
          theme.active ? 'Active' : 'Inactive'
        ]);
      });

      console.log('Table data:', tableRows);

      console.log('Adding table to document using direct autoTable...');

      // Add table to document using direct autoTable
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 120 },
          2: { cellWidth: 25 }
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });

      console.log('Table added to document');

      // Save the PDF
      const filename = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
      console.log('Saving PDF as:', filename);
      doc.save(filename);
      console.log('PDF saved successfully');
    } catch (error: any) {
      console.error('Error exporting themes to PDF:', error);
      alert(`Failed to export themes to PDF: ${error.message || 'Unknown error'}. Please check the console for details.`);
    }
  }

  /**
   * Helper method to get partner name from pairing
   */
  private getPartnerName(pairing: PrayerPairing): string {
    // This is a placeholder - you'll need to implement the logic to determine
    // which partner to display based on the current user
    return `${pairing.partner1.firstName} ${pairing.partner1.lastName}`;
  }
}
