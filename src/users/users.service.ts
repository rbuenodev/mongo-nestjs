import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { SigninDto } from './dto/singin.dto';
import { SigninOutputDto } from './dto/singin.output.dto';
import { SingupDto } from './dto/singup.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly usersModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  public async singup(singupDto: SingupDto): Promise<User> {
    const user = new this.usersModel(singupDto);
    return user.save();
  }

  public async singin(singinDto: SigninDto): Promise<SigninOutputDto> {
    const user = await this.findByEmail(singinDto.email);
    const match = await this.checkPassword(singinDto.password, user);

    if (!match) {
      throw new NotFoundException('Invalid credentials');
    }

    const jwtToken = await this.authService.createAccessToken(user._id);

    return { name: user.name, jwtToken, email: user.email };
  }

  public async findAll(): Promise<User[]> {
    return this.usersModel.find();
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    return user;
  }

  private async checkPassword(password: string, user: User): Promise<boolean> {
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new NotFoundException('Password not found');
    }
    return match;
  }
}
