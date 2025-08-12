import { BadRequestException, Body, Controller,Post } from '@nestjs/common';
import { CreateUserDTO } from './dtos/createuser.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
    constructor(private readonly userSerivce:UsersService){}

    @Post('/signup')
    CreateUser(@Body() data:CreateUserDTO){
        return this.userSerivce.create(data.email,data.password);
        
    }

    
}
