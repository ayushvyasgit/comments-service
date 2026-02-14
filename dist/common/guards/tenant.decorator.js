"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTenant = void 0;
const common_1 = require("@nestjs/common");
exports.GetTenant = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const tenant = request.tenant;
    return data ? tenant?.[data] : tenant;
});
//# sourceMappingURL=tenant.decorator.js.map