import { ActorItem } from "./actor"

export enum MovieFormat {
  Vhs = 'VHS',
  Dvd = 'DVD',
  BluRay = 'Blu-Ray'
}

export interface GetMovieResponse {
  id: string
  title: string
  year: number
  format: MovieFormat
  actorList: ActorItem[]
}

export interface DeleteMovieResponse {
  success: boolean
}

export interface CreateMovieData {
  title: string
  year: number
  format: MovieFormat
  actorIds: string[]
}

export interface CreateMoviePayload {
  data: CreateMovieData[]
}

export interface CreateMovieResponse {
  ids: string[]
}

export interface GetMoviesParams {
  title?: string
  actorName?: string
}
