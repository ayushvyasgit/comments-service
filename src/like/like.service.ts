import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LikeDto } from './dto/like.dto';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async like(tenantId: string, commentId: string, likeDto: LikeDto) {
    // Check if comment exists and belongs to tenant
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, tenantId, deletedAt: null },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user already liked
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
      throw new ConflictException('Already liked this comment');
    }

    // Use transaction for atomic operations
    const result = await this.prisma.$transaction(async (tx) => {
      // Create like
      const like = await tx.like.create({
        data: {
          tenantId,
          commentId,
          userId: likeDto.userId,
        },
      });

      // Increment like count
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

  async unlike(tenantId: string, commentId: string, userId: string) {
    // Check if comment exists and belongs to tenant
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, tenantId, deletedAt: null },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if like exists
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
      throw new NotFoundException('Like not found');
    }

    // Use transaction for atomic operations
    await this.prisma.$transaction(async (tx) => {
      // Delete like
      await tx.like.delete({
        where: {
          tenantId_commentId_userId: {
            tenantId,
            commentId,
            userId,
          },
        },
      });

      // Decrement like count (don't go below 0)
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

  async getLikes(tenantId: string, commentId: string) {
    // Check if comment exists and belongs to tenant
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, tenantId, deletedAt: null },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
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
}