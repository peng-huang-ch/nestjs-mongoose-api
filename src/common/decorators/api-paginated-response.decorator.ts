import { applyDecorators, Type } from '@nestjs/common';
import { ApiBadRequestResponse, ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { Type as Transformer } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum SortOrder {
  DESC = -1,
  ASC = 1,
}

export function getPagination(pagination?: ApiPaginatedQuery, ext?: Partial<ApiPaginatedQuery>) {
  let limit = pagination?.limit || ext?.limit || 10;
  limit = Math.max(+limit || 10, 1);

  let offset = pagination?.offset || ext?.offset || 0;
  offset = Math.max(+offset || 0, 0);

  const sortBy = pagination?.sortBy || ext?.sortBy || 'createdAt';
  const sortOrder = pagination?.sortOrder || ext?.sortOrder || SortOrder.DESC;
  const options = { limit, offset, sort: { [sortBy]: sortOrder } };
  return options;
}

export class ApiPaginatedQuery {
  @ApiProperty({ required: false, example: 10, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transformer(() => Number)
  limit: number;

  @ApiProperty({ required: false, example: 0, default: 0 })
  @IsOptional()
  @Transformer(() => Number)
  @IsInt()
  @Min(0)
  offset: number;

  @ApiProperty({ required: false, example: '_id', default: '_id' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false, enum: SortOrder, example: SortOrder.DESC })
  @IsOptional()
  @Transformer(() => Number)
  sortOrder?: number;
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
          {
            properties: {
              meta: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                  isFirstPage: { type: 'boolean', example: true },
                  isLastPage: { type: 'boolean', example: false },
                  currentPage: { type: 'number', example: 1 },
                  nextPage: { type: 'number', example: 2 },
                  pageCount: { type: 'number', example: 4 },
                  totalCount: { type: 'number', example: 10 },
                },
              },
            },
          },
        ],
      },
    }),
  );
};

export const MakeApi200Response = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(ApiOkResponse({ type: model }));
};

export const MakeApi400Response = (message: string) => {
  return applyDecorators(
    ApiBadRequestResponse({
      schema: {
        title: 'BadRequestResponse',
        properties: {
          message: { type: 'string', example: message },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'number', example: 400 },
        },
      },
    }),
  );
};
