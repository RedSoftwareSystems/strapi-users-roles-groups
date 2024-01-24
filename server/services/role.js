"use strict";

/**
 * @module services/role
 */

/**
 * @typedef {import("../types/entries").RoleActionsPermission} RoleActionsPermission
 * @typedef {import("../types/entries").RolePermissions} RolePermissions
 * @typedef {import("../types/entries").RoleAnyPermission} RoleAnyPermission
 * @typedef {import("../types/entries").InputRole} InputRole
 * @typedef {import("../types/entries").Permission} Permission
 */

/**
 * @typedef {import("@strapi/types").EntityService.Params} Params
 */

/** @type {import("../types/entries")} */
const pluginName = require("../pluginId");
const { deburr, snakeCase, omit, set } = require("lodash");
const { NotFoundError } = require("@strapi/utils").errors;
const { getService } = require("../utils");

/**
 * Roles service callback
 *
 * @param {Object} ctx
 * @param {import("@strapi/types").Strapi} ctx.strapi
 */
module.exports = ({ strapi }) => ({
  /**
   * Creates a role
   * @param {InputRole} params - Input data
   * @return {Promise<RoleAnyPermission>}
   */
  async createRole(params) {
    if (!params.type) {
      params.type = snakeCase(deburr(params.name.toLowerCase()));
    }

    const role = await strapi
      .query(`plugin::${pluginName}.role`)
      .create({ data: omit(params, ["users", "permissions"]) });

    const createPromises = Object.entries(params.permissions).flatMap(
      ([permissionName, permission]) =>
        Object.entries(permission.controllers).flatMap(
          ([controllerName, controller]) =>
            Object.entries(controller).reduce((acc, [actionName, action]) => {
              const actionID = `${permissionName}.${controllerName}.${actionName}`;
              if (action.enabled) {
                acc.push(
                  strapi
                    .query(`plugin::${pluginName}.permission`)
                    .create({ data: { action: actionID, role: role.id } })
                );
              }
              return acc;
            }, [])
        )
    );

    await Promise.all(createPromises);
  },

  /**
   * Finds a role by its id
   * @param {number} roleID
   * @returns {Promise<RoleActionsPermission>}
   */
  async findOne(roleID) {
    /**
     * @type {Role<Permission[]}
     */
    const role = await strapi
      .query(`plugin::${pluginName}.role`)
      .findOne({ where: { id: roleID }, populate: ["permissions"] });

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    const allActions = getService("users-permissions").getActions();

    // Group by `type`.
    const permissions = role.permissions.reduce((acc, permission) => {
      const [type, controller, action] = permission.action.split(".");

      return set(acc, `${type}.controllers.${controller}.${action}`, {
        enabled: true,
        policy: "",
      });
    }, allActions);

    return {
      ...role,
      permissions,
    };
  },

  /**
   * Returns all roles with associated users conunt
   * @returns {Promise<RoleAnyPermission[]>
   */
  async find() {
    /**
     * @type {Role[]}
     */
    const roles = await strapi
      .query(`plugin::${pluginName}.role`)
      .findMany({ sort: ["name"], populate: { users: { select: ["id"] } } });

    return roles.map((role) => ({
      ...role,
      nb_users: role.users?.length || 0,
    }));
  },

  /**
   * Updates a Role
   *
   * @param {number} roleID
   * @param {InputRole} inputData
   *
   * @returns {Promise<void>}
   */
  async updateRole(roleID, inputData) {
    //todo fix-me

    /**
     * @type {RolePermissions} - Role and permission
     */
    const role = await strapi
      .query(`plugin::${pluginName}.role`)
      .findOne({ where: { id: roleID }, populate: ["permissions"] });

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    // Updates data and description for the selected role
    await strapi.query(`plugin::${pluginName}.role`).update({
      where: { id: roleID },
      data: { name: inputData.name, description: inputData.description },
    });

    /**
     * @type {Permission[]}
     */
    const newActions = Object.entries(inputData.permissions).flatMap(
      ([permissionName, permission]) =>
        Object.entries(permission.controllers).flatMap(
          ([controllerName, controller]) =>
            Object.entries(controller).reduce((acc, [actionName, action]) => {
              const actionID = `${permissionName}.${controllerName}.${actionName}`;
              if (action.enabled) {
                acc.push(`${permissionName}.${controllerName}.${actionName}`);
              }
              return acc;
            }, [])
        )
    );

    /**
     * @type {string[]}
     */
    const oldActions = role.permissions?.map(({ action }) => action) || [];

    /**
     * @type {Permission[]}
     */
    const permissionsToDelete =
      role.permissions?.reduce((acc, permission) => {
        if (!newActions.includes(permission.action)) {
          acc.push(permission);
        }
        return acc;
      }, []) || [];

    /**
     * @type {Permission[]}
     */
    const actionsPermissionsToCreate = newActions
      .filter((action) => !oldActions.includes(action))
      .map((action) => ({ action, role: role.id }));

    await strapi.query(`plugin::${pluginName}.permission`).deleteMany({
      where: { id: { $in: permissionsToDelete.map((p) => p.id) } },
    });

    // await strapi
    //   .query(`plugin::${pluginName}.permission`)
    //   .createMany({ data: actionsPermissionsToCreate });

    await Promise.all(
      actionsPermissionsToCreate.map((permissionInfo) =>
        strapi
          .query(`plugin::${pluginName}.permission`)
          .create({ data: permissionInfo })
      )
    );
  },

  /**
   * Deletes a role and its permissions
   * @param {number} roleID
   * @returns {Promise<void>}
   */
  async deleteRole(roleID) {
    /**
     * @type {RolePermissions}
     */
    const role = await strapi.query(`plugin::${pluginName}.role`).delete({
      where: { id: roleID },
      populate: { permissions: { id: true } },
    });

    await strapi.query(`plugin::${pluginName}.permission`).deleteMany({
      where: {
        id: { $in: role.permissions.map((permission) => permission.id) },
      },
    });
  },
});
