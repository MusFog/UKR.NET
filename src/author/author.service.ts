import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from '../news/news.schema';
import { User } from '../user/user.schema';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<News>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async findAllAuthors(): Promise<User[]> {
    const newsAuthorsIds = await this.newsModel.find().distinct('user');
    const authors = await this.userModel.find({ '_id': { $in: newsAuthorsIds } }).select('login');
    return authors;
  }

  async findNewsByAuthor(authorId: string): Promise<News[]> {
    const authorNews = await this.newsModel.find({ user: authorId });
    if (!authorNews.length) {
      throw new NotFoundException('Новини від цього автора не знайдено');
    }
    return authorNews;
  }
}
