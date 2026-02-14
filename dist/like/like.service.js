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
exports.LikeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LikeService = class LikeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async like(tenantId, commentId, likeDto) {
        const comment = await this.prisma.comment.findFirst({
            where: { id: commentId, tenantId, deletedAt: null },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        const existingLike = await this.prisma.like.findUnique({
            where: {
                tenantId_commentId_userId: {
                    tenantId,
                    commentId,
                    userId: likeDto.userId,
                },
            },
        });
        if (existingLike) {
            throw new common_1.ConflictException('Already liked this comment');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const like = await tx.like.create({
                data: {
                    tenantId,
                    commentId,
                    userId: likeDto.userId,
                },
            });
            await tx.comment.update({
                where: { id: commentId },
                data: { likeCount: { increment: 1 } },
            });
            return like;
        });
        return {
            message: 'Comment liked successfully',
            likeId: result.id,
        };
    }
    async unlike(tenantId, commentId, userId) {
        const comment = await this.prisma.comment.findFirst({
            where: { id: commentId, tenantId, deletedAt: null },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        const existingLike = await this.prisma.like.findUnique({
            where: {
                tenantId_commentId_userId: {
                    tenantId,
                    commentId,
                    userId,
                },
            },
        });
        if (!existingLike) {
            throw new common_1.NotFoundException('Like not found');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.like.delete({
                where: {
                    tenantId_commentId_userId: {
                        tenantId,
                        commentId,
                        userId,
                    },
                },
            });
            await tx.comment.update({
                where: { id: commentId },
                data: {
                    likeCount: {
                        decrement: 1,
                    },
                },
            });
        });
        return {
            message: 'Comment unliked successfully',
        };
    }
    async getLikes(tenantId, commentId) {
        const comment = await this.prisma.comment.findFirst({
            where: { id: commentId, tenantId, deletedAt: null },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        const likes = await this.prisma.like.findMany({
            where: { tenantId, commentId },
            orderBy: { createdAt: 'desc' },
        });
        return {
            commentId,
            likeCount: likes.length,
            likes: likes.map(like => ({
                userId: like.userId,
                likedAt: like.createdAt,
            })),
        };
    }
};
exports.LikeService = LikeService;
exports.LikeService = LikeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LikeService);
//# sourceMappingURL=like.service.js.map