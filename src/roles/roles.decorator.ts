import { applyDecorators, SerializeOptions, SetMetadata } from '@nestjs/common';
import { RoleCodeEnum } from '@/enums/role/roles.enum';

export const Roles = (...roles: number[]) => {
  const rolesEnum: string[] = [];
  roles.forEach((role) => {
    rolesEnum.push(
      Object.keys(RoleCodeEnum)[Object.values(RoleCodeEnum).indexOf(role)],
    );
  });
  return applyDecorators(
    SetMetadata('roles', roles),
    SerializeOptions({ groups: rolesEnum }),
  );
};
