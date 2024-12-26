import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { PDFDocument, rgb } from 'pdf-lib';
import { firstValueFrom } from 'rxjs';

import { selectAllApplicants } from '../../applicants/state/applicants.selectors';
import { Applicant } from '../../applicants/models/applicant.model';

@Injectable({ providedIn: 'root' })
export class ExportService {
  public constructor(private readonly store: Store) {}

  /**
   * Fetches the list of applicants from the store.
   *
   * @returns {Promise<Applicant[]>} A promise resolving to the list of applicants.
   */
  private async fetchApplicants(): Promise<Applicant[]> {
    return firstValueFrom(this.store.select(selectAllApplicants));
  }

  /**
   * Exports applicants as a CSV file.
   */
  public async exportAsCSV(): Promise<void> {
    const applicants = await this.fetchApplicants();
    const csvContent = this.generateCSV(applicants);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'applicants.csv');
  }

  /**
   * Exports applicants as a JSON file.
   */
  public async exportAsJSON(): Promise<void> {
    const applicants = await this.fetchApplicants();
    const blob = new Blob([JSON.stringify(applicants, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, 'applicants.json');
  }

  /**
   * Exports applicants as an Excel file using ExcelJS.
   */
  public async exportAsExcel(): Promise<void> {
    const applicants = await this.fetchApplicants();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applicants');

    // Add headers
    worksheet.columns = [
      { header: 'First Name', key: 'firstName', width: 15 },
      { header: 'Last Name', key: 'lastName', width: 15 },
      { header: 'Available From', key: 'availableFrom', width: 20 },
      { header: 'Skills', key: 'skills', width: 30 },
    ];

    // Add rows
    applicants.forEach((applicant) => {
      worksheet.addRow({
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        availableFrom: applicant.availableFrom
          ? new Date(applicant.availableFrom).toLocaleDateString()
          : '-',
        skills: (applicant.skills || []).join(', '),
      });
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'applicants.xlsx');
  }

  /**
   * Exports applicants as a PDF file.
   */
  public async exportAsPDF(): Promise<void> {
    const applicants = await this.fetchApplicants();
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    page.drawText('Applicants List', {
      x: 50,
      y: height - 50,
      size: 20,
      color: rgb(0, 0.53, 0.71),
    });

    let yPosition = height - 100;

    applicants.forEach((applicant, index) => {
      const text = `#${index + 1} ${applicant.firstName} ${applicant.lastName}, Available From: ${
        applicant.availableFrom
          ? new Date(applicant.availableFrom).toLocaleDateString()
          : '-'
      }, Skills: ${(applicant.skills || []).join(', ')}`;
      page.drawText(text, {
        x: 50,
        y: yPosition,
        size: 12,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;
      if (yPosition < 50) {
        page = pdfDoc.addPage([600, 400]);
        yPosition = height - 50;
      }
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'applicants.pdf');
  }

  /**
   * Generates a CSV string from the list of applicants.
   *
   * @param {Applicant[]} data - The list of applicants.
   * @returns {string} CSV-formatted string.
   */
  private generateCSV(data: Applicant[]): string {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  }
}
