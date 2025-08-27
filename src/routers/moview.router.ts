import { Router } from 'express';

import { movieController as MovieController } from '../controllers/movie.controller';
import { requestDtoValidationMiddleware } from '../middlewares/request-dto-validation.middleware';
import { CreateMoviePayloadDto } from '../types/dto/create-movie.dto';
import { GetMovieByTitleDto } from '../types/dto/get-movies-params.dto';

import { multerUpload } from '../helpers/multer';
import { authMiddleware } from '../middlewares/auth.middleware';

const movieRouter = Router();

movieRouter.post(
  '/import',
  authMiddleware,
  multerUpload.single('file'),
  MovieController.importMovies,
);
movieRouter.post(
  '',
  authMiddleware,
  requestDtoValidationMiddleware(CreateMoviePayloadDto, { isBody: true }),
  MovieController.addMovie,
);
movieRouter.delete('/:id', authMiddleware, MovieController.deleteMovie);
movieRouter.get('/:id', authMiddleware, MovieController.getMovie);
movieRouter.get(
  '',
  authMiddleware,
  requestDtoValidationMiddleware(GetMovieByTitleDto, {
    isBody: false,
    isParams: false,
  }),
  MovieController.getMovieList,
);

export { movieRouter };
