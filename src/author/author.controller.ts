import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { User } from '../user/user.schema';
import { News } from '../news/news.schema';
import { AuthorService } from "./author.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findAllAuthors(): Promise<User[]> {
    return this.authorService.findAllAuthors();
  }
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findNewsByAuthor(@Param('id') authorId: string): Promise<News[]> {
    return this.authorService.findNewsByAuthor(authorId);
  }
}
