import { animesService } from './anime.service';
import { CreateanimeDto } from './dto/create-anime.dto';
import { UpdateanimeDto } from './dto/update-anime.dto';
import { anime } from './entities/anime.entity';
export declare class animesController {
    private readonly animesService;
    constructor(animesService: animesService);
    create(createanimeDto: CreateanimeDto): {
        id: number;
        src: string;
        title: string;
        description: string;
        episodes: number;
    };
    findAll(title?: string): anime[];
    findOne(id: string): anime | null;
    update(id: string, updateanimeDto: UpdateanimeDto): void;
    remove(id: string): void;
}
