import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class News extends Document {
  @Prop({
    type: Date,
    default: Date.now
  })
  date: Date;

  @Prop({
    required: true
  })
  name: string;

  @Prop({
    required: true
  })
  description: string;

  @Prop([{
    title: {
      type: String,
      required: true },
    news: {
      type: String,
      required: true
    }
  }])
  articles: Record<string, any>[];

  @Prop([{
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: Types.ObjectId,
      ref: "User"
      }
  }])
  comment: Record<string, any>[];

  @Prop({
    type: Types.ObjectId,
    ref: "Category"
  })
  category: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: "User"
  })
  user: Types.ObjectId;
}

export const NewsSchema = SchemaFactory.createForClass(News);
