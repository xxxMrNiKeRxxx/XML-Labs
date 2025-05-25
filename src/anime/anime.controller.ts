import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { animesService } from './anime.service';
import { CreateanimeDto } from './dto/create-anime.dto';
import { UpdateanimeDto } from './dto/update-anime.dto';
import { anime } from './entities/anime.entity';

@Controller('animes')
export class animesController {
  constructor(private readonly animesService: animesService) {}

  @Post()
  create(@Body() createanimeDto: CreateanimeDto) {
    return this.animesService.create(createanimeDto);
  }

  @Get()
  findAll(@Query('title') title?: string): anime[] {
    return this.animesService.findAll(title);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateanimeDto: UpdateanimeDto) {
    return this.animesService.update(+id, updateanimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.animesService.remove(+id);
  }
}
