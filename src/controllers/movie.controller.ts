import {movieService as MovieService} from "../services/movie.service";
import { NextFunction, Request, Response } from "express";

class MovieController {
  async importMovies(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const file = req?.file

      const data = await MovieService.importMovies(file)

      return res.status(201).json(data)
    } catch (err) {
      next(err)
    }
  }

  async addMovie(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const payload = req.body

      const data = await MovieService.createMovie(payload)

      return res.status(201).json(data)
    } catch (err) {
      next(err)
    }
  }

  async deleteMovie(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const {id} = req.params;

      const data = await MovieService.deleteMovie(id)

      return res.json(data);
    } catch (err) {
      next(err)
    }
  }

  async getMovie(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const {id} = req.params

      const data = await MovieService.getMovie(id)

      return res.json(data);
    } catch (err) {
      next(err)
    }
  }

  async getMovieList(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const {query: params} = req

      const data = await MovieService.getMovieList(params)

      return res.json(data)
    } catch (err) {
      next(err)
    }
  }
}

export const movieController = new MovieController();
