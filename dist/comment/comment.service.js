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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CommentService = class CommentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, createCommentDto) {
        const { parentId, ...data } = createCommentDto;
        let depth = 0;
        let path = '';
        if (parentId) {
            const parent = await this.prisma.comment.findFirst({
                where: { id: parentId, tenantId },
            });
            if (!parent) {
                throw new common_1.NotFoundException('Parent comment not found');
            }
            depth = parent.depth + 1;
            path = parent.path ? `${parent.path}.${parentId}` : parentId;
            await this.prisma.comment.update({
                where: { id: parentId },
                data: { replyCount: { increment: 1 } },
            });
        }
        const comment = await this.prisma.comment.create({
            data: {
                ...data,
                tenantId,
                parentId,
                depth,
                path,
            },
        });
        return comment;
    }
    async findAll(tenantId, query) {
        const { entityId, parentId, page, limit, sort } = query;
        const where = {
            tenantId,
            deletedAt: null,
        };
        if (entityId) {
            where.entityId = entityId;
        }
        if (parentId) {
            where.parentId = parentId;
        }
        const orderBy = sort === 'newest'
            ? { createdAt: 'desc' }
            : { createdAt: 'asc' };
        const skip = (page - 1) * limit;
        const [comments, total] = await Promise.all([
            this.prisma.comment.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.comment.count({ where }),
        ]);
        return {
            data: comments,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(tenantId, id) {
        const comment = await this.prisma.comment.findFirst({
            where: { id, tenantId, deletedAt: null },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        return comment;
    }
    async update(tenantId, id, updateCommentDto) {
        await this.findOne(tenantId, id);
        const comment = await this.prisma.comment.update({
            where: { id },
            data: updateCommentDto,
        });
        return comment;
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        await this.prisma.comment.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                status: 'DELETED',
            },
        });
        return { message: 'Comment deleted successfully' };
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentService);
//# sourceMappingURL=comment.service.js.map