import { PaginationQueryDto } from '@/common/dto/pagination.in.dto';

const prepareParameter = (defaultValue: number, value?: number) => {
  let result = value ? Number(value || defaultValue) : defaultValue;
  if (result < 1) result = defaultValue;

  return result;
};

const getPaginationParams = (query: PaginationQueryDto) => {
  const page = prepareParameter(1, query.page);
  const limit = prepareParameter(10, query.limit);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

export default getPaginationParams;
