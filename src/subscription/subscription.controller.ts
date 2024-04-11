import { Controller, Post, Body, Req, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async createOrRemove(@Req() req, @Body('category') categoryId: string) {
    return this.subscriptionService.createOrRemoveSubscription(req.user.id, categoryId);
  }
}
