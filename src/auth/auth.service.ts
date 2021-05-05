import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
// import { User as UserModel } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, // private readonly jwtServuce: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.User({ email: email });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  // async login(user: UserModel) {
  //   const payload = { email: user.email, sub: user.id };
  //   return {
  //     access_token: this.jwtServuce.sign(payload),
  //   };
  // }
}
