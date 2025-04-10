import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common/pipes/parse-uuid.pipe';

const uuidParser = new ParseUUIDPipe({ version: '4' });

// TODO: Возможно можно проще реализовать
export const ParamUUID = createParamDecorator(async (data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const parameter = request.params[data] as string;

  if (!parameter) {
    throw new HttpException(`${data} is not filled`, HttpStatus.BAD_REQUEST);
  }

  return uuidParser.transform(parameter, { metatype: String, type: 'param', data });
});
