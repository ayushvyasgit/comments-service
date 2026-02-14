import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeDto } from './dto/like.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { GetTenant } from '../common/decorators/tenant.decorator';

@Controller('comments/:commentId/like')
@UseGuards(TenantGuard, RateLimitGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async like(
    @GetTenant('id') tenantId: string,
    @Param('commentId') commentId: string,
    @Body() likeDto: LikeDto,
  ) {
    return this.likeService.like(tenantId, commentId, likeDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async unlike(
    @GetTenant('id') tenantId: string,
    @Param('commentId') commentId: string,
    @Body() likeDto: LikeDto,
  ) {
    return this.likeService.unlike(tenantId, commentId, likeDto.userId);
  }

  @Get()
  async getLikes(
    @GetTenant('id') tenantId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.likeService.getLikes(tenantId, commentId);
  }
}