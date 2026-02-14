import { Controller, Get, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../common/guards/tenant.guard';
import { GetTenant } from '../common/decorators/tenant.decorator';

@Controller('test')
@UseGuards(TenantGuard)
export class TenantTestController {
  @Get('protected')
  getProtected(@GetTenant() tenant: any) {
    return {
      message: 'You are authenticated!',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
      },
    };
  }
}