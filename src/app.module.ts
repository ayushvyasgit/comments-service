import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TenantModule } from './tenant/tenant.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { AuditModule } from './audit/audit.module';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuditModule,
    RateLimitModule,
    TenantModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}