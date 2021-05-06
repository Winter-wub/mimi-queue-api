import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Public } from 'src/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findUserById(
    @Param('id') id: string,
  ): Promise<UserModel | HttpException> {
    const user = await this.userService.User({ id: Number(id) });
    if (user) {
      delete user.password;
      return user;
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Public()
  @Post('register')
  async createUser(@Body() requestBody: UserModel): Promise<UserModel> {
    const alreadyUser = await this.userService.User({
      email: requestBody.email,
    });
    if (!alreadyUser) {
      const payload = requestBody;
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);
      return this.userService.createUser(payload);
    } else {
      throw new HttpException(
        'Already has user in system',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Put('update')
  async updateUser(@Body() requestBody: UserModel): Promise<UserModel> {
    const user = await this.userService.User({ id: requestBody.id });
    if (user) {
      const payload = requestBody;
      if (payload.password) {
        const salt = await bcrypt.genSalt(10);
        payload.password = await bcrypt.hash(payload.password, salt);
      }
      return this.userService.updateUser({
        where: { id: requestBody.id },
        data: requestBody,
      });
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('me')
  async me(@Request() req) {
    return req.user;
  }
}
