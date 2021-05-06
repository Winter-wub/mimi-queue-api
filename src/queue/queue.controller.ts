import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { Queue } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Controller('queue')
export class QueueController {
  constructor(
    private readonly queueService: QueueService,
    private readonly userService: UserService,
  ) {}

  @Get('')
  async queues(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<Queue[]> {
    return this.queueService.queues({
      take: limit,
      skip: limit * (page - 1),
      orderBy: {
        end_time: 'desc',
      },
    });
  }

  @Post('create')
  async createQueue(
    @Body()
    data: {
      title?: string;
      user_id: number;
      content?: string;
      start_time: Date;
      end_time: Date;
    },
  ): Promise<Queue> {
    const user = await this.userService.User({ id: data.user_id });
    if (user) {
      return this.queueService.createQueue({
        title: data?.title ?? '',
        content: data?.content ?? '',
        start_time: data.start_time,
        end_time: data.end_time,
        active: false,
        owner: {
          connect: { id: Number(data.user_id) },
        },
      });
    } else {
      throw new HttpException('Invalid User Id', HttpStatus.FORBIDDEN);
    }
  }

  @Put('update')
  async updateQueue(@Body() reqBody: Queue): Promise<Queue> {
    const queue = await this.queueService.queue({ id: reqBody.id });
    if (queue) {
      return this.queueService.update({
        where: { id: queue.id },
        data: reqBody,
      });
    } else {
      throw new HttpException('Invalid Queue Id', HttpStatus.FORBIDDEN);
    }
  }

  @Post('add')
  async addUserToQueue(
    @Body() data: { user_id: string; queue_id: string },
  ): Promise<void> {
    const user = await this.userService.User({ id: +data.user_id });
    if (user) {
    } else {
      throw new HttpException('Invalid User Id', HttpStatus.FORBIDDEN);
    }
  }
}
