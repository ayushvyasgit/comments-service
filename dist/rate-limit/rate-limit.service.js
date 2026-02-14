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
exports.RateLimitService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RateLimitService = class RateLimitService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkRateLimit(tenantId, window) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            return { allowed: false, remaining: 0, limit: 0 };
        }
        const limit = window === 'minute'
            ? tenant.rateLimitPerMinute
            : tenant.rateLimitPerHour;
        const now = new Date();
        const windowStart = new Date(now);
        if (window === 'minute') {
            windowStart.setSeconds(0, 0);
        }
        else {
            windowStart.setMinutes(0, 0, 0);
        }
        const count = await this.prisma.auditLog.count({
            where: {
                tenantId,
                createdAt: {
                    gte: windowStart,
                },
                success: true,
            },
        });
        const allowed = count < limit;
        const remaining = Math.max(0, limit - count);
        return { allowed, remaining, limit };
    }
    async incrementCounter(tenantId) {
        return true;
    }
};
exports.RateLimitService = RateLimitService;
exports.RateLimitService = RateLimitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RateLimitService);
//# sourceMappingURL=rate-limit.service.js.map