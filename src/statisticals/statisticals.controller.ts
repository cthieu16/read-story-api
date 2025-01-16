import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticalsService } from './statisticals.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/gaurds/gaurd.access_token';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/_schemas/user.schema';

@ApiTags('Statisticals')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard)
@Controller('statisticals')
export class StatisticalsController {
  constructor(private readonly statisticalsService: StatisticalsService) {}

  @Roles(Role.ADMIN)
  @Get('counts')
  async getStatistics() {
    return await this.statisticalsService.getStatistics();
  }
}
