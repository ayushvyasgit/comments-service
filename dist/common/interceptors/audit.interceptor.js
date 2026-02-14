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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("../../audit/audit.service");
let AuditInterceptor = class AuditInterceptor {
    constructor(auditService) {
        this.auditService = auditService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, tenant } = request;
        if (!tenant) {
            return next.handle();
        }
        const actionMap = {
            'POST /comments': 'COMMENT_CREATED',
            'PATCH /comments': 'COMMENT_UPDATED',
            'DELETE /comments': 'COMMENT_DELETED',
            'GET /comments': 'COMMENT_VIEWED',
            'POST /like': 'COMMENT_LIKED',
            'DELETE /like': 'COMMENT_UNLIKED',
        };
        let action = 'UNKNOWN';
        for (const [pattern, actionType] of Object.entries(actionMap)) {
            if (url.includes(pattern.split(' ')[1]) && method === pattern.split(' ')[0]) {
                action = actionType;
                break;
            }
        }
        const resourceId = request.params?.id || request.params?.commentId;
        return next.handle().pipe((0, operators_1.tap)(() => {
            this.auditService.log({
                tenantId: tenant.id,
                action,
                resource: 'comment',
                resourceId,
                userId: request.body?.authorId || request.body?.userId,
                userName: request.body?.authorName,
                method,
                path: url,
                success: true,
            });
        }), (0, operators_1.catchError)((error) => {
            this.auditService.log({
                tenantId: tenant.id,
                action,
                resource: 'comment',
                resourceId,
                method,
                path: url,
                success: false,
                errorMessage: error.message,
            });
            throw error;
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map