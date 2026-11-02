import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { FileStorageService } from './file-storage.service';

@Public()
@Controller('storage')
export class StorageController {
  constructor(private readonly fileStorage: FileStorageService) {}

  @Get(':userId/:fileName')
  serve(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId') userId: string,
    @Param('fileName') fileName: string,
    @Query('expires') expires = '',
    @Query('sig') signature = '',
  ): void {
    if (!this.fileStorage.isSigned(req.path, expires, signature)) {
      throw new ForbiddenException();
    }
    res.sendFile(this.fileStorage.resolveAbsolutePath(userId, fileName));
  }
}
