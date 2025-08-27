import { ActorModel } from "../models/actor.model";
import { MovieModel } from "../models/movie.model";
import { GetMovieResponse } from "../types/interfaces/movie";
import {config} from "../config/config";

class MovieDataMapper {
  toMovieItem(movie: MovieModel): GetMovieResponse {
    const {movies_upload_dir} = config

    const {dataValues: {id, title, year, format, actorList, source}} = movie

    return {id, title, year, format, source: source ? `/${movies_upload_dir}/${source}` : undefined,  actorList: actorList.map((actor: ActorModel) => {
      const {dataValues: {id, fullName}} = actor

      return {id, fullName}
    })}
  }
}

export const movieDataMapper = new MovieDataMapper()
