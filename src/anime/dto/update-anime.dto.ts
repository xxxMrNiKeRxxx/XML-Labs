import { PartialType } from '@nestjs/mapped-types';
import { CreateanimeDto } from './create-anime.dto';

export class UpdateanimeDto extends PartialType(CreateanimeDto) {}
