import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from './feedback.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(@InjectModel(Feedback.name) private feedbackModel: Model<Feedback>) {}
  async create(createFeedbackDto: CreateFeedbackDto, userId: string): Promise<Feedback> {
    const newFeedback = new this.feedbackModel({
      ...createFeedbackDto,
      user: userId,
    });
    return newFeedback.save();
  }
  async findAll(): Promise<Feedback[]> {
    return this.feedbackModel.find().populate('user', 'login').exec();
  }


  async findById(id: string): Promise<Feedback> {
    const feedback = await this.feedbackModel.findById(id).exec();
    if (!feedback) {
      throw new NotFoundException(`Відгук з ідентифікатором "${id}" не знайдено`);
    }
    console.log(feedback)
    return feedback;
  }

  async updateById(id: string, adminResponse: string): Promise<Feedback> {
    const updatedFeedback = await this.feedbackModel.findByIdAndUpdate(
      id,
      { $push: { adminResponses: { response: adminResponse, respondedAt: new Date() } } },
      { new: true },
    );
    if (!updatedFeedback) {
      throw new NotFoundException(`Відгук з ідентифікатором "${id}" не знайдено`);
    }
    return updatedFeedback;
  }
}
