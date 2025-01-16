import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppstoreTransactionDocument = AppstoreTransaction & Document;

@Schema({ timestamps: true })
export class AppstoreTransaction {
  @Prop({ required: true })
  transaction_id: string;

  @Prop({ required: true })
  original_transaction_id: string;

  @Prop({ required: true })
  web_order_line_item_id: string;

  @Prop({ required: true })
  bundle_id: string;

  @Prop({ required: true })
  product_id: string;

  @Prop({ required: true })
  subscription_group_identifier: string;

  @Prop({ required: true })
  purchase_date: string;

  @Prop({ required: true })
  original_purchase_date: string;

  @Prop({ required: true })
  expires_date: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  in_app_ownership_type: string;

  @Prop({ required: true })
  signed_date: string;

  @Prop({ required: true })
  transaction_reason: string;

  @Prop({ required: true })
  storefront: string;

  @Prop({ required: true })
  storefront_id: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  notification_type: string;

  @Prop({ required: false })
  sub_type?: string;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const AppstoreTransactionSchema =
  SchemaFactory.createForClass(AppstoreTransaction);
