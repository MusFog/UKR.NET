import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Category } from '../category/category.schema';

@Schema()
export class Subscription extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User', required: true
  })
  user: User;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category', required: true
  })
  category: Category | Types.ObjectId;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
