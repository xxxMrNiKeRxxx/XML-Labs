import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { animesModule } from './anime/anime.module';

@Module({
  imports: [animesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
