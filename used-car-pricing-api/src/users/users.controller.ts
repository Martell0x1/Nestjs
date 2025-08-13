import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/createuser.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly userSerivce: UsersService) {}

  @Post('/signup')
  CreateUser(@Body() data: CreateUserDTO) {
    return this.userSerivce.create(data.email, data.password);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userSerivce.findOne(+id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userSerivce.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userSerivce.update(+id, body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userSerivce.remove(+id);
  }
}
