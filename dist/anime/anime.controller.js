"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.animesController = void 0;
const common_1 = require("@nestjs/common");
const anime_service_1 = require("./anime.service");
const create_anime_dto_1 = require("./dto/create-anime.dto");
const update_anime_dto_1 = require("./dto/update-anime.dto");
let animesController = class animesController {
    animesService;
    constructor(animesService) {
        this.animesService = animesService;
    }
    create(createanimeDto) {
        return this.animesService.create(createanimeDto);
    }
    findAll(title) {
        return this.animesService.findAll(title);
    }
    findOne(id) {
        return this.animesService.findOne(+id);
    }
    update(id, updateanimeDto) {
        return this.animesService.update(+id, updateanimeDto);
    }
    remove(id) {
        return this.animesService.remove(+id);
    }
};
exports.animesController = animesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_anime_dto_1.CreateanimeDto]),
    __metadata("design:returntype", void 0)
], animesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], animesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], animesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_anime_dto_1.UpdateanimeDto]),
    __metadata("design:returntype", void 0)
], animesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], animesController.prototype, "remove", null);
exports.animesController = animesController = __decorate([
    (0, common_1.Controller)('animes'),
    __metadata("design:paramtypes", [anime_service_1.animesService])
], animesController);
//# sourceMappingURL=anime.controller.js.map