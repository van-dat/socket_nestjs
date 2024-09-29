import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get()
  findAll(@Query() data:any) {
    return this.userService.findAll(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return ;
  }
  
  // @UseGuards(AuthGuard)
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() data: UpdateUserDto) {
  //   console.log("id" ,id)
  //   return this.userService.update(id, data);
  // }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
