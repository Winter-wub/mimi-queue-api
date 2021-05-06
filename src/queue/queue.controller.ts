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
import { Queue, QueueUser } from '@prisma/client';
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
  ): Promise<QueueUser> {
    const user = await this.userService.User({ id: +data.user_id });
    const queue = await this.queueService.queue({ id: +data.queue_id });
    if (user && queue) {
      const usersFromQueue = await this.queueService.getUserFromQueue({
        queue_id: queue.id,
      });
      const alreadyHasUser = usersFromQueue.find((item) => item.id === user.id);
      if (alreadyHasUser) {
        throw new HttpException(
          'User has already in queue',
          HttpStatus.FORBIDDEN,
        );
      } else {
        return this.queueService.addUserToQueue({
          user: {
            connect: { id: Number(user.id) },
          },
          queue: {
            connect: { id: Number(queue.id) },
          },
          join_at: new Date(),
          cancel_at: null,
        });
      }
    } else {
      throw new HttpException(
        'Invalid User Id or Queue Id',
        HttpStatus.FORBIDDEN,
      );
    }
  }
  @Put('cancel')
  async removeUserFromQueue(
    @Body() data: { user_id: string; queue_id: string },
  ): Promise<QueueUser[]> {
    const user = await this.userService.User({ id: +data.user_id });
    const queue = await this.queueService.queue({ id: +data.queue_id });
    if (user && queue) {
      const queueUsers = await this.queueService.getUserFromQueue({
        queue_id: queue.id,
      });
      const queueUser = queueUsers.find((item) => item.user_id === user.id);
      if (queueUser) {
        await this.queueService.deleteQueueUser({
          id: queueUser.id,
        });
      } else {
        throw new HttpException('User not in this queue', HttpStatus.FORBIDDEN);
      }

      return this.queueService.getUserFromQueue({ id: queue.id });
    } else {
      throw new HttpException(
        'Invalid User Id or Queue Id',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get(':queueId')
  async queueDetail(
    @Param('queueId', ParseIntPipe) queueId: number,
  ): Promise<{ queue: Queue; users: QueueUser[] }> {
    const queue = await this.queueService.queue({ id: queueId });
    if (queue) {
      const queueUsers = await this.queueService.getUserFromQueue({
        queue_id: queue.id,
      });
      return {
        queue,
        users: queueUsers,
      };
    } else {
      throw new HttpException('Invalid Queue Id', HttpStatus.FORBIDDEN);
    }
  }
}
