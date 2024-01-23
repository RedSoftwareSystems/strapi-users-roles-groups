"use strict";

const pluginName = require("../pluginId");

/**
 * @module services/permission
 */

/**
 *
 * @typedef {import("../types/entries").Permission} Permission
 */

const PUBLIC_ROLE_FILTER = { role: { type: "public" } };

/**
 * Permissions service callback
 *
 * @param {Object} ctx
 * @param {import("@strapi/types").Strapi} ctx.strapi
 */
module.exports = ({ strapi }) => ({
  /**
   * Find permissions associated to a specific role ID
   *
   * @param {number} roleID
   *
   * @return {Promise<Permission[]>}
   */
  async findRolePermissions(roleID) {
    return await strapi
      .query(`plugin::${pluginName}.permission`)
      .findMany({ where: { role: roleID } });
  },

  /**
   * Find permissions for the public role
   *
   * @return {Promise<Permission[]>}
   */
  async findPublicPermissions() {
    return await strapi
      .query(`plugin::${pluginName}.permission`)
      .findMany({ where: PUBLIC_ROLE_FILTER });
  },

  /**
   * Transform a Users-Permissions' action into a content API one
   *
   * @param {object} permission
   * @param {string} permission.action
   *
   * @return {{ action: string }}
   */
  toContentAPIPermission(permission) {
    const { action } = permission;

    return { action };
  },
});
