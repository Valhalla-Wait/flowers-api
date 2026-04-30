import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Patch, Query } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { ProductQueryDto } from '@/modules/products/dto/product.in.dto';
import { ParamUUID } from '@/decorators/paramUuid.decorator';
import { plainToInstance } from 'class-transformer';
import { UserOutDto } from '@/modules/users/dto/user.out.dto';
import { UpdateUserDto } from '@/modules/users/dto/user.in.dto';

@Controller('users')
@ApiTags('Пользователи')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  async findOne(@ParamUUID('id') id: string) {
    const user = await this.usersService.findOneByOrError({ id });
    return plainToInstance(UserOutDto, user);
  }

  @Patch(':id')
  async update(@ParamUUID('id') id: string, @Body() updateProductDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateProductDto);
    return plainToInstance(UserOutDto, user);
  }

  @Delete(':id')
  async remove(@ParamUUID('id') id: string) {
    await this.usersService.remove(id);
  }
}
