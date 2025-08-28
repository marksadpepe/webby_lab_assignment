# Webby Lab Test Assignment - Movie Management API

## 1. Information

### Project Description
A REST API for managing movies, built as a test assignment for Webby Lab. The application supports importing movies from text files, creating, reading, and deleting movie records, and managing actors.

### Tech Stack
- **Backend**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Caching/Session Store**: Redis
- **Authentication**: Email + password with Redis-backed session tokens
- **Validation**: class-validator
- **File uploads**: Multer
- **Password hashing**: bcrypt
- **Code Quality**: ESLint + Prettier (pretty basic configuration)

### Features
- **Authentication**: user registration, login, and logout
- **Movies management**:
  - Import movies from text files
  - Create new movies
  - Get a paginated/filterable list of movies
  - Get a movie by id
  - Delete movies
- **Supported formats**: VHS, DVD, Blu-Ray
- **Actors management**: link movies with actors

### Authentication
Simple email + password authentication. On successful login, the service generates a random token (UUID) and stores it in Redis with a configurable TTL. The client must send this token in the `Authorization: Bearer <token>` header for protected endpoints. Logout removes the token from Redis, effectively ending the session.

## 2. How to run

### 2.1. Build yourself with Docker

1. **Create a ```.env``` file with required environment variables (see ```.env.example file```):**

2. **Start databases via Docker Compose:**
```bash
docker-compose up -d
```

3. **Build the Docker image:**
```bash
docker build -f build/Dockerfile -t movies_test .
```

4. **Run the application:**
```bash
docker run --rm -d --name movies -p 8000:8050 --env-file .env -e APP_PORT=8050 movies_test
```

5. **Movie file access**
To access the file you need to visit `http://localhost:YOUR_MAP_PORT/soure`, where ```source``` - path to the file on server.

The API will be available at `http://localhost:8000/api/v1`

### 2.2. Pull from Docker Hub

1. **Pull the image:**
```bash
docker pull markpark3r/movies:latest
```

2. **Create the ```.env``` file (same as in 2.1)**

3. **Run the application:**
```bash
docker run --name movies -p 8000:8050 --env-file .env -e APP_PORT=8050 markpark3r/movies:latest
```

4. **Movie file access (same as in 2.1)**

### API Endpoints

#### Auth
- `POST /api/v1/auth/register`
  - Request body:
    ```json
    { "email": "user@example.com", "password": "StrongPass123" }
    ```
    - password: non-empty string
  - Responses:
    - 201:
      ```json
      { "data": { "id": "<userId>" } }
      ```
    - 409: email already exists

- `POST /api/v1/auth/login`
  - Request body:
    ```json
    { "email": "user@example.com", "password": "StrongPass123" }
    ```
    - password: non-empty string
  - Responses:
    - 200:
      ```json
      { "data": { "token": "<sessionToken>" } }
      ```
    - 404: user not found
    - 400: invalid password

- `POST /api/v1/auth/logout`
  - Headers: `Authorization: Bearer <token>`
  - Responses:
    - 200:
      ```json
      { "data": { "success": true } }
      ```

#### Movies
- `POST /api/v1/movies/import`
  - Headers: `Authorization: Bearer <token>`
  - Form-data: `file` (text file with blocks; see Import file format)
  - Responses:
    - 201: created movies list summary

- `POST /api/v1/movies`
  - Headers: `Authorization: Bearer <token>`
  - Request body:
    ```json
    {
      "data": [
        {
          "title": "The Matrix",
          "year": 1999,
          "format": "DVD",
          "actorIds": ["<uuid>", "<uuid>"]
        }
      ]
    }
    ```
    - format: one of `Vhs`, `Dvd`, `Blu-Ray`
  - Responses:
    - 201: created entities

- `GET /api/v1/movies`
  - Headers: `Authorization: Bearer <token>`
  - Query params:
    - `title` (optional): string, exact or partial match by title
    - `actorName` (optional): string, match by actor full name
  - Responses:
    - 200: list of movies matching filters

- `GET /api/v1/movies/:id`
  - Headers: `Authorization: Bearer <token>`
  - Responses:
    - 200: movie by ID
    - 404: not found

- `DELETE /api/v1/movies/:id`
  - Headers: `Authorization: Bearer <token>`
  - Responses:
    - 200: deletion result
    - 404: not found

### Import file format
The file should contain blocks of movie data separated by blank lines (example file stores in `samples` directory):

```
Title: Movie Title
Release Year: 2023
Format: DVD
Stars: Actor 1, Actor 2, Actor 3

Title: Another Movie
Release Year: 2022
Format: Blu-Ray
Stars: Actor 4, Actor 5
```

Supported formats: VHS, DVD, Blu-Ray
