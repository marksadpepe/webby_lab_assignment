import { Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { MovieModel } from "./movie.model";
import { ActorModel } from "./actor.model";

@Table({tableName: "movies_actors", timestamps: false})
export class MovieActorModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string

  @ForeignKey(() => MovieModel)
  @Column(DataType.UUID)
  movieId: string

  @ForeignKey(() => ActorModel)
  @Column(DataType.UUID)
  actorId: string
}
