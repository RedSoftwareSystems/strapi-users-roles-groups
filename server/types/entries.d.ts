import * as Strapi from "@strapi/types";

export interface CoreEntity {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: User;
  updatedBy?: User;
}

export interface Permission extends CoreEntity {
  action?: string;
  role?: RoleAnyPermission;
}

export interface Role<T = Permission[] | ActionPermission | undefined>
  extends CoreEntity {
  name?: string;
  description?: string;
  type?: string;
  permissions?: T;
  nb_users?: number; //number of associated users
  users?: User[];
}

export type RoleActionsPermission = Role<ActionsPermission>;
export type RolePermissions = Role<Permission[]>;
export type RoleAnyPermission = Role<*>;

type TApiOrPluginPermission = string;
type TPermissionEntity = string;
type TController = string;
type TActionName = string;
export type ActionsPermission = Record<
  TActionName,
  { enabled: boolean; policy: string }
>;
export interface InputRole extends CoreEntity {
  name?: string;
  description?: string;
  type?: string;
  permissions?: Record<
    TApiOrPluginPermission,
    {
      controllers: Record<TController, ActionPermission>;
    }
  >;
  users?: User[];
}

export interface User extends CoreEntity {
  username?: string;
  email?: string;
  provider?: string;
  password?: string;
  resetPasswordToken?: string;
  confirmationToken?: string;
  confirmed?: boolean;
  blocked?: boolean;
  roles?: RoleAnyPermission[];
}
