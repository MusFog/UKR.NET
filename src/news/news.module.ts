import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { News, NewsSchema } from "./news.schema";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "../middleware/passport";
import { UserModule } from "../user/user.module";
import { SubscriptionModule } from "../subscription/subscription.module";

@Module({
  controllers: [NewsController],
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    UserModule,
    SubscriptionModule,
    PassportModule,
  ],
  providers: [NewsService, JwtStrategy],
  exports: [NewsService, MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }])],
})
export class NewsModule {}
