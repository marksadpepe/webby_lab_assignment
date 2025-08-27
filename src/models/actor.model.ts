import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { MovieModel } from './movie.model';
import { MovieActorModel } from './movie-actor.model';

@Table({ tableName: 'actors', timestamps: true, paranoid: true })
export class ActorModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ unique: true, type: DataType.STRING(100) })
  fullName: string;

  @BelongsToMany(() => MovieModel, () => MovieActorModel)
  movieList: MovieModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
