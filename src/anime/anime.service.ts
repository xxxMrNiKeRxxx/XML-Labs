import { Injectable } from '@nestjs/common';
import { CreateanimeDto } from './dto/create-anime.dto';
import { UpdateanimeDto } from './dto/update-anime.dto';
import { anime } from './entities/anime.entity';
import { FileService } from 'src/file.service';

@Injectable()
export class animesService {
  constructor(private fileService: FileService<anime[]>) {}
  create(createanimeDto: CreateanimeDto) {
    const animes = this.fileService.read();
    const anime = { ...createanimeDto, id: animes.length + 1 };
    this.fileService.add(anime);
    return anime;
  }

  findAll(title?: string): anime[] {
    const animes = this.fileService.read();

    return title
      ? animes.filter((anime) =>
          anime.title.toLowerCase().includes(title.toLowerCase()),
        )
      : animes;
  }

  findOne(id: number) {
    const animes = this.fileService.read();

    return animes.find((anime) => anime.id === id) ?? null;
  }

  update(id: number, updateanimeDto: UpdateanimeDto) {
    const animes = this.fileService.read();

    const updatedanimes = animes.map((stock) =>
      stock.id === id ? { ...stock, ...updateanimeDto } : stock,
    );

    this.fileService.write(updatedanimes);
  }

  remove(id: number) {
    const filteredanimes = this.fileService
      .read()
      .filter((anime) => anime.id !== id);

    this.fileService.write(filteredanimes);
  }
}
