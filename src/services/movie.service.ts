import { GenericResponse } from "../types/interfaces/generic";
import { CreateMoviePayload, CreateMovieResponse, DeleteMovieResponse, GetMoviesParams, GetMovieResponse } from "../types/interfaces/movie";

import {MovieModel} from "../models/movie.model";
import { ActorModel } from "../models/actor.model";

import { promises as fs } from "fs";
import * as path from "path";

import {movieDataMapper as MovieDataMapper} from '../data-mappers/movie.data-mapper';
import { ApiException } from "../exceptions/api-exception";
import { sequelize } from "../db/db";
import { Op, WhereOptions } from "sequelize";
import { MovieActorModel } from "../models/movie-actor.model";

import {fileService as FileService} from "./file.service";

class MovieService {
  async importMovies(file?: any): Promise<GenericResponse<CreateMovieResponse>> {
    if (!file) {
      throw ApiException.BadRequestException('File was not specified')
    }

    const {path: filePath} = file

    const filename = path.basename(filePath)

    const raw = await fs.readFile(filePath, "utf-8")

    const parsed = FileService.parseMoviesFile(raw);

    if (!parsed.length) {
      throw ApiException.BadRequestException('File has no valid movie records');
    }

    const titles = Array.from(new Set(parsed.map(({title}) => title)));

    const existing = await MovieModel.findAll({ where: { title: { [Op.in]: titles } } });
    
    const existingSet = new Set(existing.map(({title}) => title));

    return await sequelize.transaction(async (transaction) => {
      const createdIds: string[] = [];

      for (const movieItem of parsed) {
        const {title, stars, year, format} = movieItem

        if (existingSet.has(title)) {
          continue;
        }

        const actorModels: ActorModel[] = [];

        for (const fullName of stars) {
          const [actor] = await ActorModel.findOrCreate({
            where: { fullName },
            defaults: { fullName },
            transaction
          });

          actorModels.push(actor);
        }

        const movie = await MovieModel.create(
          { title, year, format, source: filename },
          { transaction }
        );

        const movieHasActorsList = actorModels.map(a => ({ movieId: movie.id, actorId: a.id }));

        await MovieActorModel.bulkCreate(movieHasActorsList, { transaction });

        createdIds.push(movie.id);
      }

      return { data: { ids: createdIds } };
    })
  }

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
