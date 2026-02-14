export class TenantResponseDto {
  id: string;
  name: string;
  subdomain: string;
  apiKey: string;
  plan: string;
  status: string;
  rateLimitPerMinute: number;
  rateLimitPerHour: number;
  createdAt: Date;
  updatedAt: Date;
}
