import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Subscription } from './subscription.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../category/category.schema';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async sendEmailToSubscribers(categoryId: string, description: string) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "full84132@gmail.com",
        pass: "olad vpwy nhwz zthh",
      },
    })
    try {
      const category = await this.categoryModel.findById(categoryId);
      const subscriptions = await this.subscriptionModel.find({ category: categoryId }).populate('user');

      for (let sub of subscriptions) {
        await transporter.sendMail({
          from: '"UKR.NET" <UKR.NET@gmail.com>',
          to: sub.user.email,
          subject: `Опублікована нова новина з категорії ${category.name}`,
          text: `Опис новини: ${description}`,
        });
      }
    } catch (error) {
      console.error("Помилка при відправленні листів: ", error);
    }
  }

}
