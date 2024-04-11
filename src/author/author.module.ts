import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { UserModule } from "../user/user.module";
import { NewsModule } from "../news/news.module";



@Module({
  controllers: [AuthorController],
  imports: [
    NewsModule,
    UserModule
  ],
  providers: [AuthorService],
})
export class AuthorModule {}
