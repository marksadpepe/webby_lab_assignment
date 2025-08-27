import { ApiException } from "../exceptions/api-exception";
import { MovieFormat, ParsedMovieItem } from "../types/interfaces/movie";

class FileService {
  private movieFormatMap: Record<string, MovieFormat> = {
    'vhs': MovieFormat.Vhs,
    'dvd': MovieFormat.Dvd,
    'blu-ray': MovieFormat.BluRay
  }

  parseMoviesFile(raw: string): ParsedMovieItem[] {
    const blocks = raw.split(/\r?\n\r?\n+/).map(b => b.trim()).filter(Boolean);

    const parsedMovieList: ParsedMovieItem[] = []

    for (const block of blocks) {
      const getLineValue = (label: string) => {
        const re = new RegExp(`^${label}\\s*:\\s*(.+)$`, "i");
        const line = block.split(/\r?\n/).map(s => s.trim()).find(s => re.test(s));
        return line ? (line.match(re)![1] || "").trim() : "";
      };

      const title = getLineValue("Title");
      const yearDirty = getLineValue("Release Year");
      const formatDirty = getLineValue("Format");
      const starsDirty = getLineValue("Stars");
      
      if (!title || !yearDirty || !formatDirty || !starsDirty) {
        continue;
      }

      const year = Number(yearDirty);

      if (!Number.isFinite(year)) {
        continue;
      }

      const format = formatDirty.replace(/\s+/g,"").toLowerCase().trim();
      const stars = starsDirty.split(",").map(x => x.trim()).filter(Boolean);

      const movieFormat = format in this.movieFormatMap ? this.movieFormatMap[format] : undefined

      if (!movieFormat) {
        throw ApiException.BadRequestException(`Incorrect format for "${title}" movie`)
      }
      
      parsedMovieList.push({ title, year, format: movieFormat, stars });
    }

    return parsedMovieList
  }
}

export const fileService = new FileService();
