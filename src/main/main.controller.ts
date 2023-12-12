import { Controller, Get } from '@nestjs/common';

@Controller('main')
export class MainController {
  @Get()
  test(): string {
    return 'Test';
  }
}
