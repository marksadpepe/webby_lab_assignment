import { GenericResponse } from "../types/interfaces/generic";
import { CreateMoviePayload, CreateMovieResponse, DeleteMovieResponse, GetMoviesParams, GetMovieResponse } from "../types/interfaces/movie";

import {MovieModel} from "../models/movie.model";
import { ActorModel } from "../models/actor.model";

import {movieDataMapper as MovieDataMapper} from '../data-mappers/movie.data-mapper';
import { ApiException } from "../exceptions/api-exception";
import { sequelize } from "../db/db";
import { Op, WhereOptions } from "sequelize";
import { MovieActorModel } from "../models/movie-actor.model";

class MovieService {
  async createMovie(data: CreateMoviePayload): Promise<GenericResponse<CreateMovieResponse>> {
    const {data: movieList} = data 

    const titleSet = new Set<string>()
    const actorIdList: string[] = []

    movieList.forEach((movieItem) => {
      const {actorIds, title} = movieItem

      actorIdList.push(...actorIds)
      titleSet.add(title)
    })

    const actorIdsSet = new Set(actorIdList)

    return await sequelize.transaction(async (transaction) => {
      const existingMovies = await MovieModel.findAll({
        where: {
          title: {[Op.in]: Array.from(titleSet)}
        } 
      })

      if (existingMovies.length) {
        throw ApiException.ConflictException('One of these movies already exist')
      }

      const actorList = await ActorModel.findAll({
        where: {
          id: {[Op.in]: Array.from(actorIdsSet)}
        }
      })

      if (actorList.length !== actorIdsSet.size) {
        throw ApiException.NotFoundException('Some of the actors not found')
      }

      const createdMovieIds: string[] = []

      for (const movie of movieList) {
        const {title, year, format, actorIds} = movie

        const movieEntity = await MovieModel.create({title, year, format}, {transaction})

        const movieHasActorsRelations = actorIds.map((actorId) => ({
          movieId: movieEntity.id,
          actorId
        }))

        await MovieActorModel.bulkCreate(movieHasActorsRelations, {transaction})

        createdMovieIds.push(movieEntity.id)
      }

      return {data: {ids: createdMovieIds}}
    })
  }

  async deleteMovie(id: string): Promise<GenericResponse<DeleteMovieResponse>> {
    const movie = await MovieModel.findByPk(id);

    if (!movie) {
      throw ApiException.NotFoundException(`Movie ${id} not found`);
    }

    await movie.destroy();

    const count = await MovieModel.count({where: {id}})

    return {data: {success: count === 0}}
  }

  async getMovie(id: string): Promise<GenericResponse<GetMovieResponse>> {
    const movie = await MovieModel.findOne({where: {id}, include: [
      {model: ActorModel, as: "actorList", through: {attributes: []}}
    ]})

    if (!movie) {
      throw ApiException.NotFoundException(`Movie ${id} not found`);
    }

    return {data: MovieDataMapper.toMovieItem(movie)}
  }

  async getMovieList(params: GetMoviesParams): Promise<GenericResponse<GetMovieResponse[]>> {
    const {title, actorName} = params

    const movieWhereOptions: WhereOptions | undefined = title ? { title } : undefined
    const actorWhereOptions: WhereOptions | undefined = actorName ? {fullName: actorName} : undefined

    const movies = await MovieModel.findAll({
      where: movieWhereOptions,
      include: [{
        model: ActorModel,
        as: "actorList",
        where: actorWhereOptions,
        through: { attributes: [] }
      }],
      order: [['title', 'ASC']]
    })

    return {data: movies.map((movie) => MovieDataMapper.toMovieItem(movie))}
  }
}

export const movieService = new MovieService();
