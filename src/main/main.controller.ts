import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as csvtojson from 'csvtojson/v2';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
  constructor(private mainService: MainService) {}

  @Get('bookings-amenity-id')
  async bookingsAmenityId(
    @Query('amenityId') amenityId: number,
    @Query('timestamp') timestamp: string,
  ): Promise<any> {
    return await this.mainService.findByAmenityId(amenityId, timestamp);
  }

  @Get('bookings-user-id')
  async bookingsUserId(@Query('userId') userId: number): Promise<any> {
    return await this.mainService.findByUserId(userId);
  }

  @Post('upload-csv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const res = await csvtojson({ delimiter: 'auto' }).fromString(
      file.buffer.toString(),
    );
    return res;
  }
}
