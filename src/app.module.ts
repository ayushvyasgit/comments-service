import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TenantModule } from './tenant/tenant.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TenantModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}