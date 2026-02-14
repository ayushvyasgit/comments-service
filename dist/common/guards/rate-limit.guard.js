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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const rate_limit_service_1 = require("../../rate-limit/rate-limit.service");
const audit_service_1 = require("../../audit/audit.service");
let RateLimitGuard = class RateLimitGuard {
    constructor(rateLimitService, auditService) {
        this.rateLimitService = rateLimitService;
        this.auditService = auditService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const tenant = request.tenant;
        if (!tenant) {
            return true;
        }
        const minuteCheck = await this.rateLimitService.checkRateLimit(tenant.id, 'minute');
        response.header('X-RateLimit-Limit', minuteCheck.limit.toString());
        response.header('X-RateLimit-Remaining', minuteCheck.remaining.toString());
        response.header('X-RateLimit-Window', 'minute');
        if (!minuteCheck.allowed) {
            await this.auditService.log({
                tenantId: tenant.id,
                action: 'RATE_LIMIT_EXCEEDED',
                resource: 'api',
                method: request.method,
                path: request.url,
                metadata: {
                    window: 'minute',
                    limit: minuteCheck.limit,
                },
                success: false,
            });
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                message: 'Rate limit exceeded',
                limit: minuteCheck.limit,
                remaining: 0,
                window: 'minute',
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        return true;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rate_limit_service_1.RateLimitService,
        audit_service_1.AuditService])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map