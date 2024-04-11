import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from './subscription.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
  ) {}

  async createOrRemoveSubscription(userId: string, categoryId: string): Promise<Subscription | { message: string }> {
    try {
      const existingSubscription = await this.subscriptionModel.findOne({ user: userId, category: categoryId });

      if (existingSubscription) {
        await this.subscriptionModel.deleteOne({ user: userId, category: categoryId });
        return { message: 'Ви успішно відписані від цієї категорії.' };
      }

      const subscription = new this.subscriptionModel({ user: userId, category: categoryId });
      await subscription.save();
      return subscription;
    } catch (e) {
      throw new HttpException('Помилка при обробці підписки.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
