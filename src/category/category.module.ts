import { forwardRef, Module } from "@nestjs/common";
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./category.schema";
import { NewsModule } from "../news/news.module";
import { SubscriptionModule } from "../subscription/subscription.module";

@Module({
  controllers: [CategoryController],
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    forwardRef(() => NewsModule),
    SubscriptionModule
    ],
  providers: [CategoryService],
  exports: [CategoryService, MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])]
})
export class CategoryModule {}
