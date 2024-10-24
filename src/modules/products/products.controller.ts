import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from '@/modules/products/products.service';
import { CreateProductDto, UpdateProductDto } from '@/modules/products/dto/product.in.dto';
import { Public } from '@/auth/decorators/is-public';
import { plainToInstance } from 'class-transformer';
import { ProductOutDto } from '@/modules/products/dto/product.out.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return plainToInstance(ProductOutDto, product);
  }

  @Get()
  @Public({
    withoutAdminProtection: true,
  })
  async findAll() {
    const products = await this.productsService.findAll();
    return plainToInstance(ProductOutDto, products);
  }

  @Get(':id')
  @Public({
    withoutAdminProtection: true,
  })
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    return plainToInstance(ProductOutDto, product);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const product = await this.productsService.update(id, updateProductDto);
    return plainToInstance(ProductOutDto, product);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return {
      message: 'Success',
    };
  }
}
