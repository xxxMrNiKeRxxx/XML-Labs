import { CreateanimeDto } from './dto/create-anime.dto';
import { UpdateanimeDto } from './dto/update-anime.dto';
import { anime } from './entities/anime.entity';
import { FileService } from 'src/file.service';
export declare class animesService {
    private fileService;
    constructor(fileService: FileService<anime[]>);
    create(createanimeDto: CreateanimeDto): {
        id: number;
        src: string;
        title: string;
        description: string;
        episodes: number;
    };
    findAll(title?: string): anime[];
    findOne(id: number): anime | null;
    update(id: number, updateanimeDto: UpdateanimeDto): void;
    remove(id: number): void;
}
