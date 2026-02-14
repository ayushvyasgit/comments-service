import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createCommentDto: CreateCommentDto) {
    const { parentId, ...data } = createCommentDto;

    let depth = 0;
    let path = '';

    // If reply, validate parent and calculate depth/path
    if (parentId) {
      const parent = await this.prisma.comment.findFirst({
        where: { id: parentId, tenantId },
      });

      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }

      depth = parent.depth + 1;
      path = parent.path ? `${parent.path}.${parentId}` : parentId;

      // Update parent reply count
      await this.prisma.comment.update({
        where: { id: parentId },
        data: { replyCount: { increment: 1 } },
      });
    }

    // Create comment
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

  async findAll(tenantId: string, query: QueryCommentDto) {
    const { entityId, parentId, page, limit, sort } = query;

    const where: any = {
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
      ? { createdAt: 'desc' as const }
      : { createdAt: 'asc' as const };

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

  async findOne(tenantId: string, id: string) {
    const comment = await this.prisma.comment.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(tenantId: string, id: string, updateCommentDto: UpdateCommentDto) {
    // Verify comment exists and belongs to tenant
    await this.findOne(tenantId, id);

    const comment = await this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });

    return comment;
  }

  async remove(tenantId: string, id: string) {
    // Verify comment exists and belongs to tenant
    await this.findOne(tenantId, id);

    // Soft delete
    await this.prisma.comment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
      },
    });

    return { message: 'Comment deleted successfully' };
  }
}