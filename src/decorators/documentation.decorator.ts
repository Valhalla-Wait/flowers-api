import { ApiResponseDocumentation } from '@/common/types';
import { Type, applyDecorators } from '@nestjs/common';
import { ApiOkResponse as ApiResponse, getSchemaPath, ApiOperation } from '@nestjs/swagger';

const ApiResponseWithPagination = <TModel extends Type<unknown>>(model: TModel) => {
  return applyDecorators(
    ApiResponse({
      schema: {
        required: ['data', 'meta'],
        properties: {
          list: {
            type: 'array',
            items: {
              oneOf: [{ $ref: getSchemaPath(model) }],
            },
          },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'number' },
              pages: { type: 'number' },
              total: { type: 'number' },
              limit: { type: 'number' },
            },
          },
        },
      },
    }),
  );
};

export function ApiDocumentation(params: ApiResponseDocumentation) {
  const decorators: MethodDecorator[] = [];

  if (params?.summary) {
    decorators.push(ApiOperation({ summary: params?.summary }));
  }

  if (params?.type) {
    decorators.push(
      params.withPagination
        ? ApiResponseWithPagination(params?.type)
        : ApiResponse({ type: params?.type }),
    );
  }

  return applyDecorators(...decorators);
}
