import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '@/modules/products/dto/product.in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '@/modules/products/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductsException } from '@/exceptions/products.exception';
import { PaginationQueryDto } from '@/common/dto/pagination.in.dto';
import getPaginationParams from '@/utils/getPaginationParams';
import getPaginationMeta from '@/utils/getPaginationMeta';
import { plainToInstance } from 'class-transformer';
import { ProductOutDto } from '@/modules/products/dto/product.out.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  private Exception = ProductsException;

  async findOneByIdOrError(id: string) {
    const founded = await this.productsRepository.findOneBy({ id });

    if (!founded) {
      throw this.Exception.NotFound();
    }

    return founded;
  }

  async create(createProductDto: CreateProductDto) {
    const productEntity = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(productEntity);
  }

  async findAll(query: PaginationQueryDto) {
    const { skip, limit, page } = getPaginationParams(query);

    const [products, total] = await this.productsRepository.findAndCount({
      skip,
      take: limit,
    });

    const meta = getPaginationMeta({ total, limit, page });

    // TODO: Вынести генерацию на глобальный уровень + добавить функцию для генерации paginationResponse
    return {
      list: plainToInstance(ProductOutDto, products),
      meta,
    };
  }

  findOne(id: string) {
    return this.findOneByIdOrError(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // TODO: Использовать возвращаемые данные из update для определения наличия записи
    await this.findOneByIdOrError(id);

    await this.productsRepository.update({ id }, updateProductDto);

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOneByIdOrError(id);

    return this.productsRepository.delete({ id });
  }
}
