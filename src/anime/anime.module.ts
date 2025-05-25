import { Module } from '@nestjs/common';
import { animesService } from './anime.service';
import { animesController } from './anime.controller';
import { FileService } from 'src/file.service';
import { anime } from './entities/anime.entity';

@Module({
  controllers: [animesController],
  providers: [animesService,
    {
      provide: FileService,
      useFactory: () => new FileService<anime[]>('assets/anime.json'),
    },
  ],
})
export class animesModule {}
