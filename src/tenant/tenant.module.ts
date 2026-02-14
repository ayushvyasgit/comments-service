import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TenantTestController } from './tenant-test.controller';

@Module({
  controllers: [TenantController, TenantTestController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}