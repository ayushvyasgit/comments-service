import { PrismaService } from '../prisma/prisma.service';
import { LikeDto } from './dto/like.dto';
export declare class LikeService {
    private prisma;
    constructor(prisma: PrismaService);
    like(tenantId: string, commentId: string, likeDto: LikeDto): Promise<{
        message: string;
        likeId: string;
    }>;
    unlike(tenantId: string, commentId: string, userId: string): Promise<{
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
