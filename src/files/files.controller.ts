import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';
import { DeleteResult } from 'typeorm';
import { FileEntity } from './entities/file.entity';
import {
  FileFastifyInterceptor,
  FilesFastifyInterceptor,
  MulterFile,
} from 'fastify-file-interceptor';
import { createReadStream } from 'fs';
import { join } from 'path';
import * as mime from 'mime-types';
import { MapInterceptor } from 'automapper-nestjs';
import { FileDto } from '@/domains/files/file.dto';
import { NullableType } from '../utils/types/nullable.type';
import { PresignedUrlResponseDto } from '@/domains/files/presign-url-response.dto';

@ApiTags('Files')
@ApiBearerAuth()
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiBearerAuth()
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileFastifyInterceptor('file'))
  @UseInterceptors(MapInterceptor(FileEntity, FileDto))
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(@UploadedFile() file: MulterFile | Express.MulterS3.File) {
    return this.filesService.uploadFile(file);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesFastifyInterceptor('files', 10))
  @UseInterceptors(MapInterceptor(FileEntity, FileDto, { isArray: true }))
  @HttpCode(HttpStatus.CREATED)
  @Post('upload-multiple')
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<MulterFile | Express.MulterS3.File>,
  ): Promise<FileEntity[]> {
    return this.filesService.uploadMultipleFiles(files);
  }

  @HttpCode(HttpStatus.OK)
  @Get('local/:path')
  displayFile(@Param('path') path, @Res() res) {
    const filePath = join(process.cwd(), 'uploads', path);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    console.log('path', filePath);
    // Set the Content-Disposition to inline to display in the browser
    res.header('Content-Disposition', `inline; filename="${path}"`);

    // Set the Content-Type based on the file extension
    res.header('Content-Type', mimeType);

    // Stream the file to the browser
    const stream = createReadStream(filePath);
    return res.send(stream);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('presigned/:type')
  async getPresignedUrl(
    @Param('type') type: string,
  ): Promise<PresignedUrlResponseDto> {
    return await this.filesService.getPresignedUrl(type);
  }

  @UseInterceptors(MapInterceptor(FileEntity, FileDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<FileEntity>> {
    return this.filesService.findOne({ id });
  }

  /**
   * Update a file in storage and database
   * @returns {Promise<FileEntity>} updated file
   * @param id
   * @param file {MulterFile | Express.MulterS3.File} file to update
   */
  @ApiOperation({
    summary: 'Update a file in storage and database',
    description: 'This endpoint update a file in storage and database.',
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileFastifyInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async updateFile(
    @Param('id') id: string,
    @UploadedFile() file: MulterFile | Express.MulterS3.File,
  ): Promise<FileEntity> {
    return this.filesService.updateFile(id, file);
  }

  /**
   * Delete a file in storage and database
   * @returns {Promise<DeleteResult>} updated file
   * @param id file id
   */
  @ApiOperation({
    summary: 'Delete a file in storage and database',
    description: 'This endpoint delete a file from storage and database.',
  })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteFile(@Param('id') id: string): Promise<DeleteResult> {
    return await this.filesService.deleteFile(id);
  }
}
