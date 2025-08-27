import { BelongsToMany, Column, CreatedAt, DataType, Default, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { MovieFormat } from "../types/interfaces/movie";
import { ActorModel } from "./actor.model";
import { MovieActorModel } from "./movie-actor.model";

@Table({tableName: "movies", timestamps: true, paranoid: true})
export class MovieModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string

  @Column({type: DataType.STRING(100), unique: true})
  title: string

  @Column(DataType.SMALLINT)
  year: number

  @Column({type: DataType.ENUM(...Object.values(MovieFormat))})
  format: MovieFormat

  @BelongsToMany(() => ActorModel, () => MovieActorModel)
  actorList: ActorModel[]

  @CreatedAt
  createdAt: Date

  @UpdatedAt
  updatedAt: Date

  @DeletedAt
  deletedAt: Date
}
