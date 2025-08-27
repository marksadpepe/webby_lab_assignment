import { ActorModel } from "../models/actor.model";
import { MovieModel } from "../models/movie.model";
import { GetMovieResponse } from "../types/interfaces/movie";

class MovieDataMapper {
  toMovieItem(movie: MovieModel): GetMovieResponse {
    const {dataValues: {id, title, year, format, actorList}} = movie

    return {id, title, year, format, actorList: actorList.map((actor: ActorModel) => {
      const {dataValues: {id, fullName}} = actor

      return {id, fullName}
    })}
  }
}

export const movieDataMapper = new MovieDataMapper()
