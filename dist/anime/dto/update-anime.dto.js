"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateanimeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_anime_dto_1 = require("./create-anime.dto");
class UpdateanimeDto extends (0, mapped_types_1.PartialType)(create_anime_dto_1.CreateanimeDto) {
}
exports.UpdateanimeDto = UpdateanimeDto;
//# sourceMappingURL=update-anime.dto.js.map