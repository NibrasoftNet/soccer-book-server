import { IsString, IsEnum } from 'class-validator';
import { ExportFileType } from '../enums/export.enum';

export class ExportDtoWithoutData {
  @IsString()
  file_path: string;

  @IsEnum(ExportFileType)
  file_type: ExportFileType;
}
