import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
export declare class CommentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, createCommentDto: CreateCommentDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.CommentStatus;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        entityId: string;
        authorId: string;
        authorName: string;
        authorEmail: string | null;
        content: string;
        tenantId: string;
        depth: number;
        path: string;
        likeCount: number;
        replyCount: number;
        deletedAt: Date | null;
    }>;
    findAll(tenantId: string, query: QueryCommentDto): Promise<{
        data: {
            id: string;
            status: import(".prisma/client").$Enums.CommentStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            entityId: string;
            authorId: string;
            authorName: string;
            authorEmail: string | null;
            content: string;
            tenantId: string;
            depth: number;
            path: string;
            likeCount: number;
            replyCount: number;
            deletedAt: Date | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.CommentStatus;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        entityId: string;
        authorId: string;
        authorName: string;
        authorEmail: string | null;
        content: string;
        tenantId: string;
        depth: number;
        path: string;
        likeCount: number;
        replyCount: number;
        deletedAt: Date | null;
    }>;
    update(tenantId: string, id: string, updateCommentDto: UpdateCommentDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.CommentStatus;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        entityId: string;
        authorId: string;
        authorName: string;
        authorEmail: string | null;
        content: string;
        tenantId: string;
        depth: number;
        path: string;
        likeCount: number;
        replyCount: number;
        deletedAt: Date | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        message: string;
    }>;
}
