import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { News } from "../news/news.schema";
import { QueryParamsDto } from "./dto/query-params.dto";
import { Subscription } from "../subscription/subscription.schema";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(News.name) private newsModel: Model<News>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
  ) {}

  async getAll(offset: number, limit: number): Promise<Category[]> {
    return this.categoryModel
      .find()
      .skip(offset)
      .limit(limit);
  }

  async getById(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new HttpException('Категорія не знайдена', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await this.categoryModel.deleteOne({ _id: id });
    if (deleteResult.deletedCount === 0) {
      throw new HttpException('Категорія не знайдена', HttpStatus.NOT_FOUND);
    }
    await this.newsModel.deleteMany({ category: id });
    await this.subscriptionModel.deleteMany({ category: id });
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true });
    if (!updatedCategory) {
      throw new HttpException('Категорія не знайдена', HttpStatus.NOT_FOUND);
    }
    return updatedCategory;
  }
  async findAll(query: QueryParamsDto): Promise<{ data: Category[], total: number }> {
    const { offset, limit } = query;
    const [data, total] = await Promise.all([
      this.categoryModel.find().skip(Number(offset)).limit(Number(limit)),
      this.categoryModel.countDocuments()
    ]);
    return { data, total };
  }
}
