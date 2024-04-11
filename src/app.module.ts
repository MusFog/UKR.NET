import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoryModule } from './category/category.module';
import { NewsModule } from './news/news.module';
import { AuthorModule } from './author/author.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { FeedbackModule } from './feedback/feedback.module';
import { CacheModule } from "@nestjs/cache-manager";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { APP_INTERCEPTOR } from "@nestjs/core";

const keys = require("./config/keys")
@Module({
  imports: [
    MongooseModule.forRoot(keys.mongoURI),
    UserModule,
    CategoryModule,
    NewsModule,
    CacheModule.register( {
      isGlobal: true
    }),
    AuthorModule,
    SubscriptionModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor,
  }],
})

export class AppModule {}
