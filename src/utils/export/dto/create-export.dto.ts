import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ExportFileType } from '../enums/export.enum';

export class ExportDto {
  @IsString()
  file_path: string;

  @IsEnum(ExportFileType)
  file_type: ExportFileType;

  @IsArray()
  @IsNotEmpty()
  data: any[];
}
