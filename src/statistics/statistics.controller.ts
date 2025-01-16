import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/gaurds/gaurd.access_token';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/_schemas/user.schema';

@ApiTags('Statistics')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Roles(Role.ADMIN)
  @Get('counts')
  async getStatistics() {
    return await this.statisticsService.getStatistics();
  }
}
