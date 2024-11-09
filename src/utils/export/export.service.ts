import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { Worker } from 'worker_threads';
import * as ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { ExportDto } from './dto/create-export.dto';
import { ExportFileType } from './enums/export.enum';
import { workerThreadFilePath } from '../worker/config';

@Injectable()
export class ExportService {
  async workerExport(exportDto: ExportDto): Promise<void> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerThreadFilePath, {
        workerData: {
          filePath: exportDto.file_path,
          fileType: exportDto.file_type,
          data: exportDto.data,
        },
      });
      worker.on('message', (message) => {
        resolve(message);
      });
      worker.on('error', (err) => {
        console.error('Worker threw an error:', err);
        reject(err);
      });
      worker.on('exit', (code) => {
        console.log('Worker did exit with code:', code);
      });
    });
  }

  async exportToCsvExcel(
    filePath: string,
    fileType: ExportFileType,
    data: any[],
  ): Promise<void> {
    try {
      // Flatten the columns where column = object
      const flattenedData = this.flattenArray(data);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('export');

      // Create headers based on the properties of the first item
      const headers = Object.keys(flattenedData[0]);
      worksheet.addRow(headers);

      // Add rows based on properties of each item
      flattenedData.forEach((item) => {
        const row = headers.map((header) => item[header]);
        worksheet.addRow(row);
      });

      // un-hide the headers
      worksheet.columns.forEach((column) => {
        // eslint-disable-next-line no-param-reassign
        column.hidden = false;
      });

      // Write the workbook to a buffer
      const bufferWorkbook = (
        fileType === ExportFileType.XLSX
          ? await workbook.xlsx.writeBuffer()
          : await workbook.csv.writeBuffer()
      ) as string | NodeJS.ArrayBufferView;

      // Save the Excel file to the server
      const fileToExportPath = path.join(
        filePath,
        `${new Date()
          .toISOString()
          .replace(/[-T:.Z]/g, '')}-trashback-export.${fileType}`,
      );
      fs.writeFileSync(fileToExportPath, bufferWorkbook);
    } catch (error) {
      throw new PreconditionFailedException(
        `{"export": "No content to export ${error}"}`,
      );
    }
  }

  /**
   * Flatten nested objects
   * @param obj
   * @param parentKey
   */
  flattenObject(obj: Record<string, any>, parentKey = ''): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in obj) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(result, this.flattenObject(obj[key], newKey));
        //result = { ...result, ...this.flattenObject(obj[key], newKey) };
      } else {
        result[newKey] = obj[key];
      }
    }
    return result;
  }

  flattenArray(array: Record<string, any>[]): Record<string, any>[] {
    return array.map((item) => this.flattenObject(item));
  }
}
