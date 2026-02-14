import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from 'src/common/dto/update-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
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
