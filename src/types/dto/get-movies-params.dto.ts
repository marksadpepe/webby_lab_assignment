import { IsOptional, IsString } from "class-validator";
import { GetMoviesParams } from "../interfaces/movie";

export class GetMovieByTitleDto implements GetMoviesParams {
  @IsString({message: 'title must be a string'})
  @IsOptional()
  title?: string

  @IsString({message: 'actor name must be a string'})
  @IsOptional()
  actorName?: string
}
