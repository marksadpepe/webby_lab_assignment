import {Router} from "express";

import {movieController as MovieController} from "../controllers/movie.controller";

import {requestDtoValidationMiddleware} from "../middlewares/request-dto-validation.middleware";
import { CreateMoviePayloadDto } from "../types/dto/create-movie.dto";
import { GetMovieByTitleDto } from "../types/dto/get-movies-params.dto";

const movieRouter = Router()

movieRouter.post("/movies", requestDtoValidationMiddleware(CreateMoviePayloadDto, {isBody: true}), MovieController.addMovie);
movieRouter.delete("/movies/:id",  MovieController.deleteMovie);
movieRouter.get("/movies/:id", MovieController.getMovie);
movieRouter.get("/movies", requestDtoValidationMiddleware(GetMovieByTitleDto, {isBody: false, isParams: false}), MovieController.getMovieList);

export {movieRouter};
