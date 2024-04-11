import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseInterceptors,
  Put,
  Req,
  UseGuards, HttpStatus, HttpCode
} from "@nestjs/common";
import { NewsService } from './news.service';
import { CreateNewsDto} from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { News } from "./news.schema";
import { AuthGuard } from "@nestjs/passport";
import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";




@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query) {
    return this.newsService.findAll(query);
  }
  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findAllP(@Query() query) {
    return this.newsService.findAllCache(query);
  }
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: string): Promise<News> {
    return this.newsService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req, @Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto, req.user.id);
  }
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.newsService.delete(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto): Promise<News> {
    return this.newsService.update(id, updateNewsDto);
  }

  @Post('comment/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  addComment(@Param('id') id: string, @Body() addCommentDto: AddCommentDto, @Req() req): Promise<News> {
    return this.newsService.addComment(id, addCommentDto, req.user._id);
  }
}
