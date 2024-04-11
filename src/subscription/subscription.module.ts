import { forwardRef, Module } from "@nestjs/common";
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Subscription, SubscriptionSchema } from "./subscription.schema";
import { EmailService } from "./sendEmailToSubscribers.service";
import { CategoryModule } from "../category/category.module";

@Module({
  controllers: [SubscriptionController],
  imports: [
    MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }]),
    forwardRef(() => CategoryModule)
  ],
  providers: [SubscriptionService, EmailService],
  exports: [SubscriptionService, EmailService, MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }])]
})
export class SubscriptionModule {}
