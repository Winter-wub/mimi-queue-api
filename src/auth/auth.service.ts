import { Injectable, Logger } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
// import { User as UserModel } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, // private readonly jwtServuce: JwtService,
  ) {}

  private readonly logging = new Logger(AuthService.name);

  async validateUser(email: string, password: string): Promise<any> {
    this.logging.log('working !!');
    const user = await this.userService.User({ email: email });
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
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
