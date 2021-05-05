import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(':id')
  async findUserById(
    @Param('id') id: string,
  ): Promise<UserModel | HttpException> {
    const user = await this.userService.User({ id: Number(id) });
    if (user) {
      return user;
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('register')
  async createUser(@Body() requestBody: UserModel): Promise<UserModel> {
    return this.userService.createUser(requestBody);
  }

  @Put('update')
  async updateUser(@Body() requestBody: UserModel): Promise<UserModel> {
    const user = await this.userService.User({ id: requestBody.id });
    if (user) {
      return this.userService.updateUser({
        where: { id: requestBody.id },
        data: requestBody,
      });
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
