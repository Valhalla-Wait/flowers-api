import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '@/modules/products/dto/product.in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '@/modules/products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const productEntity = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(productEntity);
  }

  async findAll() {
    return this.productsRepository.find();
  }

  findOne(id: string) {
    return this.productsRepository.findOneBy({
      id,
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.productsRepository.update({ id }, updateProductDto);

    return this.findOne(id);
  }

  async remove(id: string) {
    return this.productsRepository.delete({ id });
  }
}
