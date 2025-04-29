import { ProductEntity } from '@/modules/products/entities/product.entity';

export const CalculateProductCountInStock = (product: ProductEntity) => {
  // TODO: может вынести в BeforeSelect, протестировать
  // NOTE:
  // Подсчитываем кол-во доступных товаров исходя из кол-ва расходников
  // Это позволит видеть пользователям сколько товара осталось и не заказывать больше чем есть расходников на складе
  // Что позволит избежать выяснений по телефону
  let inStockCount = 0;

  product.productConsumables.forEach(({ requiredCount, consumable }) => {
    const countByConsumables = Math.floor(consumable.count / requiredCount);

    if (inStockCount === 0 || countByConsumables < inStockCount) {
      inStockCount = countByConsumables;
    }
  });

  return inStockCount;
};
