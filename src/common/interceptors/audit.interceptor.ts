import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, tenant } = request;

    // Only audit if tenant exists (authenticated requests)
    if (!tenant) {
      return next.handle();
    }

    const actionMap: Record<string, string> = {
  'POST /comments': 'COMMENT_CREATED',
  'PATCH /comments': 'COMMENT_UPDATED',
  'DELETE /comments': 'COMMENT_DELETED',
  'GET /comments': 'COMMENT_VIEWED',
  'POST /like': 'COMMENT_LIKED',
  'DELETE /like': 'COMMENT_UNLIKED',
};


    let action = 'UNKNOWN';
    for (const [pattern, actionType] of Object.entries(actionMap)) {
      if (url.includes(pattern.split(' ')[1]) && method === pattern.split(' ')[0]) {
        action = actionType;
        break;
      }
    }

    const resourceId = request.params?.id || request.params?.commentId;

    return next.handle().pipe(
      tap(() => {
        this.auditService.log({
          tenantId: tenant.id,
          action,
          resource: 'comment',
          resourceId,
          userId: request.body?.authorId || request.body?.userId,
          userName: request.body?.authorName,
          method,
          path: url,
          success: true,
        });
      }),
      catchError((error) => {
        this.auditService.log({
          tenantId: tenant.id,
          action,
          resource: 'comment',
          resourceId,
          method,
          path: url,
          success: false,
          errorMessage: error.message,
        });
        throw error;
      }),
    );
  }
}