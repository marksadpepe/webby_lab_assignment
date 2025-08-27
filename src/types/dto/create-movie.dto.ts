import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  CreateMovieData,
  CreateMoviePayload,
  MovieFormat,
} from '../interfaces/movie';
import { Type } from 'class-transformer';

class CreateMovieDataDto implements CreateMovieData {
  @IsString({ message: 'title must be a string' })
  title: string;

  @IsNumber({}, { message: 'year must be a number' })
  year: number;

  @IsEnum(MovieFormat, {
    message: `format must be one of: ${Object.values(MovieFormat)}`,
  })
  format: MovieFormat;

  @IsArray({ message: 'actor ID list must be an array' })
  @IsUUID('4', { each: true, message: 'actor ID must be a UUIDv4 string' })
  actorIds: string[];
}

export class CreateMoviePayloadDto implements CreateMoviePayload {
  @IsArray({ message: 'must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateMovieDataDto)
  data: CreateMovieDataDto[];
}
