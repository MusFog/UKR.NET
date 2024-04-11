import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from './news.schema';
import { CreateNewsDto} from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { EmailService } from "../subscription/sendEmailToSubscribers.service";
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from "@nestjs/cache-manager";


@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private readonly newsModel: Model<News>,
              @Inject(CACHE_MANAGER) private cacheManager: Cache,
              private emailService: EmailService) {}

  // async findAllCache(query: any): Promise<News[]> {
  //   const cachedData: News[] = await this.cacheManager.get<News[]>('news-cache-key');
  //   if (cachedData) {
  //     return cachedData;
  //   }
  //   console.log('!cachedData')
  //
  //   const newsData = await this.newsModel.find().exec();
  //   await this.cacheManager.set('news-cache-key', newsData, 100);
  //   return newsData;
  // }

  async findAll(query: any): Promise<News[]> {
    const filter: any = {};
    if (query.categoryId) {
      const categoryIds = Array.isArray(query.categoryId) ? query.categoryId : [query.categoryId];
      filter.category = { $in: categoryIds };
    }

    if (query.news) {
      filter.news = +query.news;
    }

    const result = await this.newsModel.find(filter)
      .skip(+query.offset)
      .limit(+query.limit )
      .exec();
    return result;
  }
  public async findAllCache(query: any): Promise<{ data: News[], total: number }> {
    const cacheKey = `CacheForQuery:${JSON.stringify(query)}`;
    const cachedResult = await this.cacheManager.get<{ data: News[], total: number }>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    const filter: any = {};
    if (query.categoryId) {
      const categoryIds = Array.isArray(query.categoryId) ? query.categoryId : [query.categoryId];
      filter.category = { $in: categoryIds };
    }
    if (query.news) {
      filter.news = +query.news;
    }
    const [result, total] = await Promise.all([
      this.newsModel.find(filter).skip(+query.offset).limit(+query.limit).exec(),
      this.newsModel.countDocuments(filter)
    ]);
    const response = { data: result, total: total };
    await this.cacheManager.set(cacheKey, response, 300000);
    return response;
  }



  async findById(id: string): Promise<News> {
    const news = await this.newsModel.findById(id).populate('user', 'login').populate('comment.user', 'login').exec();
    if (!news) {
      throw new NotFoundException(`Новини з ідентифікатором "${id}" не знайдено`);
    }
    return news;
  }

  async create(createNewsDto: CreateNewsDto, userId: string): Promise<News> {
    try {
      const newNews = new this.newsModel({
        ...createNewsDto,
        user: userId,
      });
      const savedNews = await newNews.save();
      this.emailService.sendEmailToSubscribers(savedNews.category.toString(), savedNews.description);
      return savedNews;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const updatedNews = await this.newsModel.findByIdAndUpdate(id, updateNewsDto, { new: true }).exec();
    if (!updatedNews) {
      throw new NotFoundException(`Новини з ідентифікатором "${id}" не знайдено`);
    }
    return updatedNews;
  }

  async delete(id: string): Promise<void> {
    const result = await this.newsModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Новини з ідентифікатором "${id}" не знайдено`);
    }
  }

  async addComment(id: string, addCommentDto: AddCommentDto, userId: string): Promise<News> {
    const comment = {
      text: addCommentDto.text,
      user: userId,
      createdAt: new Date()
    };
    const news = await this.newsModel.findByIdAndUpdate(
      id,
      { $push: { comment: comment } },
      { new: true }
    ).populate('comment.user').exec();

    if (!news) {
      throw new NotFoundException(`Новини з ідентифікатором "${id}" не знайдено`);
    }

    return news;
  }

}
