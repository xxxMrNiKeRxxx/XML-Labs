"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.animesModule = void 0;
const common_1 = require("@nestjs/common");
const anime_service_1 = require("./anime.service");
const anime_controller_1 = require("./anime.controller");
const file_service_1 = require("../file.service");
let animesModule = class animesModule {
};
exports.animesModule = animesModule;
exports.animesModule = animesModule = __decorate([
    (0, common_1.Module)({
        controllers: [anime_controller_1.animesController],
        providers: [anime_service_1.animesService,
            {
                provide: file_service_1.FileService,
                useFactory: () => new file_service_1.FileService('assets/anime.json'),
            },
        ],
    })
], animesModule);
//# sourceMappingURL=anime.module.js.map