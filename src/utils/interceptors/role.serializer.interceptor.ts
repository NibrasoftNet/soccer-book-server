import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  PlainLiteralObject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RolesSerializerInterceptor extends ClassSerializerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userRoleId = request.user?.role?.id;

    // Map role ID to serialization groups
    const groups = this.getSerializationGroups(userRoleId);

    // Merge with existing serialization options
    const contextOptions = this.getContextOptions(context);
    const options = {
      ...this.defaultOptions,
      ...contextOptions,
      groups,
    };

    return next
      .handle()
      .pipe(
        map((res: PlainLiteralObject | PlainLiteralObject[]) =>
          this.serialize(res, options),
        ),
      );
  }

  private getSerializationGroups(roleId: number): string[] {
    // Define serialization groups for each role ID
    const roleGroupMap = {
      1: ['SUPERADMIN'], // For role ID 1 (Admin)
      2: ['USER'], // For role ID 2 (User)
      3: ['ADMIN'],
      // Add other roles as necessary
    };
    return roleGroupMap[roleId] || [];
  }
}
