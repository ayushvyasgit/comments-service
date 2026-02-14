import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { GetTenant } from '../common/decorators/tenant.decorator';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';

@Controller('comments')
@UseGuards(TenantGuard, RateLimitGuard)
@UseInterceptors(AuditInterceptor)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetTenant('id') tenantId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(tenantId, createCommentDto);
  }

  @Get()
  async findAll(
    @GetTenant('id') tenantId: string,
    @Query() query: QueryCommentDto,
  ) {
    return this.commentService.findAll(tenantId, query);
  }

  @Get(':id')
  async findOne(
    @GetTenant('id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.commentService.findOne(tenantId, id);
  }

  @Patch(':id')
  async update(
    @GetTenant('id') tenantId: string,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(tenantId, id, updateCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @GetTenant('id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.commentService.remove(tenantId, id);
  }
}