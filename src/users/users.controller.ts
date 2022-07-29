import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SigninDto } from './dto/singin.dto';
import { SigninOutputDto } from './dto/singin.output.dto';
import { SingupDto } from './dto/singup.dto';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('singup')
  @HttpCode(HttpStatus.CREATED)
  public async sinup(@Body() singupDto: SingupDto): Promise<User> {
    return this.usersService.singup(singupDto);
  }

  @Post('singin')
  @HttpCode(HttpStatus.OK)
  public async singin(@Body() singinDto: SigninDto): Promise<SigninOutputDto> {
    return this.usersService.singin(singinDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
