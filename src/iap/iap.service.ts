import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Model } from 'mongoose';
import { GooglePayTransaction } from 'src/_schemas/googlepay-transaction.schema';

@Injectable()
export class IapService {
  private playDeveloperApi;

  constructor(
    @InjectModel(GooglePayTransaction.name)
    private googlePayTransactionModel: Model<GooglePayTransaction>,
    private configService: ConfigService,
  ) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: this.configService.get<string>('GOOGLE_PROJECT_ID'),
        private_key: this.configService.get<string>('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
        client_email: this.configService.get<string>('GOOGLE_CLIENT_EMAIL'),
      },
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });    

    this.playDeveloperApi = google.androidpublisher({ version: 'v3', auth });
  }

  async verifyReceipt(
    purchaseToken: string,
    packageName: string,
    productId: string,
  ) {
    
    try {
      const response = await this.playDeveloperApi.purchases.subscriptions.get({
        packageName,
        subscriptionId: productId,
        token: purchaseToken,
      });
      
      const transactionData = {
        start_time_millis: response.data.startTimeMillis,
        expiry_time_millis: response.data.expiryTimeMillis,
        auto_renewing: response.data.autoRenewing ? 'true' : 'false',
        price_currency_code: response.data.priceCurrencyCode,
        price_amount_micros: response.data.priceAmountMicros,
        country_code: response.data.countryCode,
        developer_payload: response.data.developerPayload,
        cancel_reason: response.data.cancelReason,
        user_cancellation_time_millis: response.data.userCancellationTimeMillis,
        order_id: response.data.orderId,
        purchase_type: response.data.purchaseType,
        acknowledgement_state: response.data.acknowledgementState,
        kind: response.data.kind,
        is_deleted: false,
      };

      await this.googlePayTransactionModel.create(transactionData);

      return {
        success: true,
        message: 'Receipt verified successfully',
        data: transactionData,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to verify receipt',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}