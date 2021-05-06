import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Queue as QueueModel,
  QueueUser as QueueUserModel,
  Prisma,
} from '@prisma/client';

@Injectable()
export class QueueService {
  constructor(private prismaService: PrismaService) {}

  async createQueue(data: Prisma.QueueCreateInput): Promise<QueueModel> {
    return this.prismaService.queue.create({ data });
  }

  async update(params: {
    where: Prisma.QueueWhereUniqueInput;
    data: Prisma.QueueUpdateInput;
  }): Promise<QueueModel> {
    return this.prismaService.queue.update(params);
  }

  async queues(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.QueueWhereUniqueInput;
    where?: Prisma.QueueWhereInput;
    orderBy?: Prisma.QueueOrderByInput;
  }): Promise<QueueModel[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.queue.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async queue(params: Prisma.QueueWhereUniqueInput) {
    return this.prismaService.queue.findUnique({ where: params });
  }

  async addUserToQueue(
    data: Prisma.QueueUserCreateInput,
  ): Promise<QueueUserModel> {
    return this.prismaService.queueUser.create({ data });
  }

  async deleteQueueUser(data: Prisma.QueueUserWhereUniqueInput): Promise<any> {
    return this.prismaService.queueUser.update({
      where: { id: Number(data.id) },
      data: { cancel_at: new Date(), status: 'CANCEL' },
    });
  }

  async getUserFromQueue(
    data: Prisma.QueueUserWhereInput,
  ): Promise<QueueUserModel[]> {
    return this.prismaService.queueUser.findMany({ where: data });
  }
}
