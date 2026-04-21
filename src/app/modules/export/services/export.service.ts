import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { PDFDocument, rgb } from 'pdf-lib';
import { firstValueFrom } from 'rxjs';

import { APP_CONFIG } from '../../../config/app.config';
import { FullState } from '../../../models/full-state.model';
import {
  CSV_DOUBLE_QUOTE,
  CSV_FIELD_NEEDS_QUOTING,
  WHITESPACE_RUN,
} from '../../../utilities/RegEx';
import { selectAllApplicants } from '../../applicants/state/applicants.selectors';
import { Applicant } from '../../applicants/models/applicant.model';
import { ExportFormats } from '../enums/export-formats.enum';

@Injectable({ providedIn: 'root' })
export class ExportService {
  public constructor(private readonly store: Store<FullState>) {}

  private get config() {
    return APP_CONFIG.EXPORT;
  }

  /** Human-readable experience for spreadsheet/PDF (English; headers are English). */
  private formatExperienceYears(years: number | undefined | null): string {
    if (years === undefined || years === null) {
      return this.config.DEFAULT_EMPTY_VALUE;
    }
    return years === 1
      ? `${years} ${this.config.EXPERIENCE_SINGLE_LABEL}`
      : `${years} ${this.config.EXPERIENCE_PLURAL_LABEL}`;
  }

  private formatDateForDisplay(date: Date | string | undefined | null): string {
    return date
      ? new Date(date).toLocaleDateString()
      : this.config.DEFAULT_MISSING_VALUE;
  }

  private formatDateForCSV(date: Date | string | undefined | null): string {
    return date
      ? new Date(date)
          .toISOString()
          .slice(0, this.config.CSV.DATE_SLICE_END_INDEX)
      : this.config.DEFAULT_EMPTY_VALUE;
  }

  private normalizeText(text: string | undefined | null): string {
    return (text ?? this.config.DEFAULT_EMPTY_VALUE)
      .replace(WHITESPACE_RUN, ' ')
      .trim();
  }

  private toExcelRow(applicant: Applicant): Record<string, string> {
    return {
      name: applicant.name ?? this.config.DEFAULT_EMPTY_VALUE,
      currentJobTitle:
        applicant.currentJobTitle ?? this.config.DEFAULT_EMPTY_VALUE,
      location: applicant.location ?? this.config.DEFAULT_EMPTY_VALUE,
      yearsOfExperience: this.formatExperienceYears(
        applicant.yearsOfExperience
      ),
      applicationStatus:
        applicant.applicationStatus ?? this.config.DEFAULT_EMPTY_VALUE,
      email: applicant.email ?? this.config.DEFAULT_EMPTY_VALUE,
      phone: applicant.phone ?? this.config.DEFAULT_EMPTY_VALUE,
      availableFrom: this.formatDateForDisplay(applicant.availableFrom),
      skills: (applicant.skills ?? []).join(this.config.EXCEL.SKILLS_DELIMITER),
      notes: applicant.notes ?? this.config.DEFAULT_EMPTY_VALUE,
    };
  }

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
    const blob = new Blob([csvContent], {
      type: this.config.MIME_TYPES[ExportFormats.CSV],
    });
    saveAs(blob, this.config.FILE_NAMES[ExportFormats.CSV]);
  }

  /**
   * Exports applicants as a JSON file.
   */
  public async exportAsJSON(): Promise<void> {
    const applicants = await this.fetchApplicants();
    const blob = new Blob(
      [JSON.stringify(applicants, null, this.config.JSON_INDENT_SPACES)],
      {
        type: this.config.MIME_TYPES[ExportFormats.JSON],
      }
    );
    saveAs(blob, this.config.FILE_NAMES[ExportFormats.JSON]);
  }

  private getExcelColumns(): Array<{
    header: string;
    key: string;
    width: number;
  }> {
    return this.config.EXCEL.COLUMNS.map((column) => ({
      header: column.header,
      key: column.key,
      width: column.width,
    }));
  }

  /**
   * Exports applicants as an Excel file using ExcelJS.
   */
  public async exportAsExcel(): Promise<void> {
    const applicants = await this.fetchApplicants();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(this.config.EXCEL.WORKSHEET_NAME);
    worksheet.columns = this.getExcelColumns();
    applicants.forEach((applicant) =>
      worksheet.addRow(this.toExcelRow(applicant))
    );

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: this.config.MIME_TYPES[ExportFormats.EXCEL],
    });
    saveAs(blob, this.config.FILE_NAMES[ExportFormats.EXCEL]);
  }

  /**
   * Exports applicants as a PDF file.
   */
  public async exportAsPDF(): Promise<void> {
    const applicants = await this.fetchApplicants();
    const pdfDoc = await PDFDocument.create();
    const pageSize: [number, number] = [
      this.config.PDF.PAGE.WIDTH,
      this.config.PDF.PAGE.HEIGHT,
    ];
    let page = pdfDoc.addPage(pageSize);
    const { height } = page.getSize();

    page.drawText(this.config.PDF.TITLE, {
      x: this.config.PDF.TITLE_X,
      y: height - this.config.PDF.TITLE_TOP_OFFSET,
      size: this.config.PDF.TITLE_FONT_SIZE,
      color: rgb(
        this.config.PDF.TITLE_COLOR.r,
        this.config.PDF.TITLE_COLOR.g,
        this.config.PDF.TITLE_COLOR.b
      ),
    });

    let yPosition = height - this.config.PDF.BODY_TOP_OFFSET;

    applicants.forEach((applicant, index) => {
      const notesPart = applicant.notes?.trim()
        ? `${this.config.PDF.NOTES_PREFIX}${this.normalizeText(applicant.notes)}`
        : this.config.DEFAULT_EMPTY_VALUE;
      const yearsPart =
        applicant.yearsOfExperience !== undefined &&
        applicant.yearsOfExperience !== null
          ? this.formatExperienceYears(applicant.yearsOfExperience)
          : this.config.DEFAULT_MISSING_VALUE;
      const text = `${this.config.PDF.LIST_ITEM_PREFIX}${index + 1} ${
        applicant.name ?? this.config.DEFAULT_EMPTY_VALUE
      }${this.config.PDF.FIELD_SEPARATOR}${
        applicant.currentJobTitle ?? this.config.DEFAULT_EMPTY_VALUE
      }${this.config.PDF.FIELD_SEPARATOR}${
        applicant.location ?? this.config.DEFAULT_EMPTY_VALUE
      }${this.config.PDF.FIELD_SEPARATOR}${yearsPart}${
        this.config.PDF.FIELD_SEPARATOR
      }${applicant.applicationStatus ?? this.config.DEFAULT_MISSING_VALUE}${
        this.config.PDF.FIELD_SEPARATOR
      }${applicant.email ?? this.config.DEFAULT_EMPTY_VALUE}${
        this.config.PDF.FIELD_SEPARATOR
      }${applicant.phone ?? this.config.DEFAULT_EMPTY_VALUE}${
        this.config.PDF.FIELD_SEPARATOR
      }${this.config.PDF.AVAILABLE_FROM_LABEL}${this.config.PDF.LABEL_SEPARATOR}${this.formatDateForDisplay(
        applicant.availableFrom
      )}${this.config.PDF.FIELD_SEPARATOR}${this.config.PDF.SKILLS_LABEL}${
        this.config.PDF.LABEL_SEPARATOR
      }${(applicant.skills ?? []).join(this.config.PDF.SKILLS_DELIMITER)}${notesPart}`;
      page.drawText(text, {
        x: this.config.PDF.BODY_X,
        y: yPosition,
        size: this.config.PDF.BODY_FONT_SIZE,
        color: rgb(
          this.config.PDF.BODY_COLOR.r,
          this.config.PDF.BODY_COLOR.g,
          this.config.PDF.BODY_COLOR.b
        ),
      });
      yPosition -= this.config.PDF.ROW_STEP;
      if (yPosition < this.config.PDF.PAGE_BREAK_MIN_Y) {
        page = pdfDoc.addPage(pageSize);
        yPosition = height - this.config.PDF.TITLE_TOP_OFFSET;
      }
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as BlobPart], {
      type: this.config.MIME_TYPES[ExportFormats.PDF],
    });
    saveAs(blob, this.config.FILE_NAMES[ExportFormats.PDF]);
  }

  /**
   * Generates a CSV string from the list of applicants.
   *
   * @param {Applicant[]} data - The list of applicants.
   * @returns {string} CSV-formatted string.
   */
  private generateCSV(data: Applicant[]): string {
    if (data.length === 0) {
      return this.config.DEFAULT_EMPTY_VALUE;
    }
    const headers = this.config.CSV.HEADERS;
    const escape = (value: string): string => {
      if (CSV_FIELD_NEEDS_QUOTING.test(value)) {
        return `"${value.replace(CSV_DOUBLE_QUOTE, '""')}"`;
      }
      return value;
    };
    const row = (a: Applicant): string =>
      [
        a.id,
        a.name ?? this.config.DEFAULT_EMPTY_VALUE,
        a.email ?? this.config.DEFAULT_EMPTY_VALUE,
        a.phone ?? this.config.DEFAULT_EMPTY_VALUE,
        a.location ?? this.config.DEFAULT_EMPTY_VALUE,
        a.yearsOfExperience ?? this.config.DEFAULT_EMPTY_VALUE,
        a.applicationStatus ?? this.config.DEFAULT_EMPTY_VALUE,
        a.currentJobTitle ?? this.config.DEFAULT_EMPTY_VALUE,
        this.formatDateForCSV(a.availableFrom),
        (a.skills ?? []).join(this.config.CSV.SKILLS_DELIMITER),
        this.normalizeText(a.notes),
      ]
        .map((cell) => escape(String(cell)))
        .join(this.config.CSV.DELIMITER);
    return [headers.join(this.config.CSV.DELIMITER), ...data.map(row)].join(
      this.config.CSV.EOL
    );
  }
}
