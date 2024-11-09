import { Injectable } from '@nestjs/common';
import { Helpers } from 'graphile-worker';
import { Task, TaskHandler } from 'nestjs-graphile-worker';
import { ExportService } from '../export/export.service';

@Injectable()
@Task('export')
export class ExportTask {
  constructor(private readonly exportService: ExportService) {}
  //   private logger = new Logger(ExportTask.name);

  @TaskHandler()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handler(payload: any, _helpers: Helpers) {
    // this.logger.log(`Export ${JSON.stringify(payload)}`);
    await this.exportService.exportToCsvExcel(
      payload.file_path,
      payload.file_type,
      payload.data,
    );
  }
}
