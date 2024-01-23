"use strict";
const pluginName = require("../pluginId");

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
      pluginName,
    },
    {
      section: "plugins",
      displayName: "Read",
      uid: "roles.read",
      subCategory: "roles",
      pluginName,
    },
    {
      section: "plugins",
      displayName: "Update",
      uid: "roles.update",
      subCategory: "roles",
      pluginName,
    },
    {
      section: "plugins",
      displayName: "Delete",
      uid: "roles.delete",
      subCategory: "roles",
      pluginName,
    },
    {
      // providers
      section: "plugins",
      displayName: "Read",
      uid: "providers.read",
      subCategory: "providers",
      pluginName,
    },
    {
      section: "plugins",
      displayName: "Edit",
      uid: "providers.update",
      subCategory: "providers",
      pluginName,
    },
    {
      // emailTemplates
      section: "plugins",
      displayName: "Read",
      uid: "email-templates.read",
      subCategory: "emailTemplates",
      pluginName,
    },
    {
      section: "plugins",
      displayName: "Edit",
      uid: "email-templates.update",
      subCategory: "emailTemplates",
      pluginName,
    },
    {
      // advancedSettings
      section: "plugins",
      displayName: "Read",
      uid: "advanced-settings.read",
      subCategory: "advancedSettings",
      pluginName,
    },
    {
      section: "plugins",
      displayName: "Edit",
      uid: "advanced-settings.update",
      subCategory: "advancedSettings",
      pluginName,
    },
  ],
};

module.exports = pluginActions;
