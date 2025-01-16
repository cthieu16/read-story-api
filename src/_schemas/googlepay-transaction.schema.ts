import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GooglePayTransactionDocument = GooglePayTransaction & Document;

@Schema({ timestamps: true })
export class GooglePayTransaction {
  @Prop({ required: false })
  start_time_millis?: string;

  @Prop({ required: false })
  expiry_time_millis?: string;

  @Prop({ required: false })
  auto_renewing?: string;

  @Prop({ required: false })
  price_currency_code?: string;

  @Prop({ required: false })
  price_amount_micros?: string;

  @Prop({ required: false })
  country_code?: string;

  @Prop({ required: false })
  developer_payload?: string;

  @Prop({ required: false })
  cancel_reason?: string;

  @Prop({ required: false })
  user_cancellation_time_millis?: string;

  @Prop({ required: false })
  order_id?: string;

  @Prop({ required: false })
  purchase_type?: string;

  @Prop({ required: false })
  acknowledgement_state?: string;

  @Prop({ required: false })
  kind?: string;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const GooglePayTransactionSchema =
  SchemaFactory.createForClass(GooglePayTransaction);
