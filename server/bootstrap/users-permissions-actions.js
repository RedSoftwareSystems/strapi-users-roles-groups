"use strict";
const packageJson = require("../../package.json");
const pluginName = packageJson.strapi.name;

/**
 * The Grant provider type.
 * @typedef {Object} UserPermissionAction
 * @property {string} section
 * @property {string} displayName
 * @property {string} uid
 * @property {string} subCategory
 * @property {string} pluginName
 */

/**
 * @constant {{action: UserPermissionAction[]}}
 */
const pluginActions = {
  actions: [
    {
      // Roles
      section: "plugins",
      displayName: "Create",
      uid: "roles.create",
      subCategory: "roles",
      pluginName: "users-permissions",
    },
    {
      section: "plugins",
      displayName: "Read",
      uid: "roles.read",
      subCategory: "roles",
      pluginName: "users-permissions",
    },
    {
      section: "plugins",
      displayName: "Update",
      uid: "roles.update",
      subCategory: "roles",
      pluginName: "users-permissions",
    },
    {
      section: "plugins",
      displayName: "Delete",
      uid: "roles.delete",
      subCategory: "roles",
      pluginName: "users-permissions",
    },
    {
      // providers
      section: "plugins",
      displayName: "Read",
      uid: "providers.read",
      subCategory: "providers",
      pluginName: "users-permissions",
    },
    {
      section: "plugins",
      displayName: "Edit",
      uid: "providers.update",
      subCategory: "providers",
      pluginName: "users-permissions",
    },
    {
      // emailTemplates
      section: "plugins",
      displayName: "Read",
      uid: "email-templates.read",
      subCategory: "emailTemplates",
      pluginName: "users-permissions",
    },
    {
      section: "plugins",
      displayName: "Edit",
      uid: "email-templates.update",
      subCategory: "emailTemplates",
      pluginName: "users-permissions",
    },
    {
      // advancedSettings
      section: "plugins",
      displayName: "Read",
      uid: "advanced-settings.read",
      subCategory: "advancedSettings",
      pluginName: "users-permissions",
    },
    {
      section: "plugins",
      displayName: "Edit",
      uid: "advanced-settings.update",
      subCategory: "advancedSettings",
      pluginName: "users-permissions",
    },
  ],
};

module.exports = pluginActions;
