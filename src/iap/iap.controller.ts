import {
  Body,
  Controller,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/gaurds/gaurd.access_token';
import { IapService } from './iap.service';

@ApiTags('IAP')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard)
@Controller('iap')
export class IapController {
  constructor(private readonly iapService: IapService) {}

  @Post('verify-receipt/android')
  async verifyGoogleReceipt(
    @Body()
    body: {
      purchaseToken: string;
      packageName: string;
      productId: string;
    },
  ) {
    const { purchaseToken, packageName, productId } = body;

    return await this.iapService.verifyReceipt(
      purchaseToken,
      packageName,
      productId,
    );
  }
}
