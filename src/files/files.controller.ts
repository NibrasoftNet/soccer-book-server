import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Response,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
import { HttpResponseException } from '../utils/exceptions/http-response.exception';

@ApiTags('Files')
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
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
  ) {
    try {
      return this.filesService.uploadFile(file);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('file'))
  @Post('upload-multiple')
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File | Express.MulterS3.File>,
  ) {
    try {
      return this.filesService.uploadMultipleFiles(files);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Get(':path')
  download(@Param('path') path, @Response() response) {
    try {
      return response.sendFile(path, { root: './uploads' });
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  /**
   * Update a file in storage and database
   * @returns {Promise<FileEntity>} updated file
   * @param id
   * @param file {Express.Multer.File | Express.MulterS3.File} file to update
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
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
  ): Promise<FileEntity> {
    try {
      return this.filesService.updateFile(id, file);
    } catch (error) {
      throw new HttpResponseException(error);
    }
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
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteFile(@Param('id') id: string): Promise<DeleteResult> {
    try {
      return await this.filesService.deleteFile(id);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }
}
