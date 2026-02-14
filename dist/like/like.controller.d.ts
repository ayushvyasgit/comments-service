import { LikeService } from './like.service';
import { LikeDto } from './dto/like.dto';
export declare class LikeController {
    private readonly likeService;
    constructor(likeService: LikeService);
    like(tenantId: string, commentId: string, likeDto: LikeDto): Promise<{
        message: string;
        likeId: string;
    }>;
    unlike(tenantId: string, commentId: string, likeDto: LikeDto): Promise<{
        message: string;
    }>;
    getLikes(tenantId: string, commentId: string): Promise<{
        commentId: string;
        likeCount: number;
        likes: {
            userId: string;
            likedAt: Date;
        }[];
    }>;
}
