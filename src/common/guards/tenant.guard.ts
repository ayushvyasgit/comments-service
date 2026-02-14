import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TenantService } from '../../tenant/tenant.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private tenantService: TenantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Extract API key from header
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    // Find tenant by API key
    const tenant = await this.tenantService.findByApiKey(apiKey);

    if (!tenant) {
      throw new UnauthorizedException('Invalid API key');
    }

    if (tenant.status !== 'ACTIVE') {
      throw new UnauthorizedException('Tenant is not active');
    }

    // Attach tenant to request
    request.tenant = tenant;

    return true;
  }
}