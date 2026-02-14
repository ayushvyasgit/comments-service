import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentDto } from '../comment/dto/query-comment.dto';
export declare class CommentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, createCommentDto: CreateCommentDto): Promise<any>;
    findAll(tenantId: string, query: QueryCommentDto): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(tenantId: string, id: string): Promise<any>;
    update(tenantId: string, id: string, updateCommentDto: UpdateCommentDto): Promise<any>;
    remove(tenantId: string, id: string): Promise<{
        message: string;
    }>;
}
