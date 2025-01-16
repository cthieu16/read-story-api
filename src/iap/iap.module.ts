import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GooglePayTransaction,
  GooglePayTransactionSchema,
} from 'src/_schemas/googlepay-transaction.schema';
import { IapController } from './iap.controller';
import { IapService } from './iap.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GooglePayTransaction.name, schema: GooglePayTransactionSchema },
    ]),
  ],
  controllers: [IapController],
  providers: [IapService, ConfigService],
})
export class IapModule {}
