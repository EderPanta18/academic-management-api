import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginatedMetaDto } from './paginated-meta.dto';

export class PaginatedResponseDto<TItems> {
  @ApiProperty({ isArray: true })
  @Type(() => Object)
  items: TItems[];

  @ApiProperty({ type: PaginatedMetaDto })
  meta: PaginatedMetaDto;
}
