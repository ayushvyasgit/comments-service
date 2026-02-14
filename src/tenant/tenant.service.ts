import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './create-tenant.dto';
import * as crypto from 'crypto';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async create(createTenantDto: CreateTenantDto) {
    const existing = await this.prisma.tenant.findUnique({
      where: { subdomain: createTenantDto.subdomain },
    });

    if (existing) {
      throw new ConflictException('Subdomain already exists');
    }

    const apiKey = this.generateApiKey();
    const hashedApiKey = this.hashApiKey(apiKey);

    const tenant = await this.prisma.tenant.create({
      data: {
        ...createTenantDto,
        apiKey: hashedApiKey,
      },
    });

    return {
      ...tenant,
      apiKey,
    };
  }

  async findAll() {
    return this.prisma.tenant.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant ${id} not found`);
    }

    return tenant;
  }

  async findByApiKey(apiKey: string) {
    const hashedKey = this.hashApiKey(apiKey);
    return this.prisma.tenant.findUnique({
      where: { apiKey: hashedKey },
    });
  }

  async update(id: string, updateData: any) {
    await this.findOne(id);

    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: updateData,
    });

    return tenant;
  }

  private generateApiKey(): string {
    const randomBytes = crypto.randomBytes(32).toString('hex');
    return `tenant_${randomBytes}`;
  }

  private hashApiKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }
}