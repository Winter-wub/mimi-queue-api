import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [QueueService, PrismaService, UserService],
  controllers: [QueueController],
})
export class QueueModule {}
