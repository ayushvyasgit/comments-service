export declare enum PlanDto {
    FREE = "FREE",
    STARTER = "STARTER",
    BUSINESS = "BUSINESS",
    ENTERPRISE = "ENTERPRISE"
}
export declare class CreateTenantDto {
    name: string;
    subdomain: string;
    plan?: PlanDto;
}
