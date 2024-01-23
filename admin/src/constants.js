import pluginName from "./pluginId";
export const PERMISSIONS = {
  // Roles
  accessRoles: [
    { action: `plugin::${pluginName}.roles.create`, subject: null },
    { action: `plugin::${pluginName}.roles.read`, subject: null },
  ],
  createRole: [{ action: `plugin::${pluginName}.roles.create`, subject: null }],
  deleteRole: [{ action: `plugin::${pluginName}.roles.delete`, subject: null }],
  readRoles: [{ action: `plugin::${pluginName}.roles.read`, subject: null }],
  updateRole: [{ action: `plugin::${pluginName}.roles.update`, subject: null }],

  // AdvancedSettings
  readAdvancedSettings: [
    { action: `plugin::${pluginName}.advanced-settings.read`, subject: null },
  ],
  updateAdvancedSettings: [
    { action: `plugin::${pluginName}.advanced-settings.update`, subject: null },
  ],

  // Emails
  readEmailTemplates: [
    { action: `plugin::${pluginName}.email-templates.read`, subject: null },
  ],
  updateEmailTemplates: [
    { action: `plugin::${pluginName}.email-templates.update`, subject: null },
  ],

  // Providers
  readProviders: [
    { action: `plugin::${pluginName}.providers.read`, subject: null },
  ],
  updateProviders: [
    { action: `plugin::${pluginName}.providers.update`, subject: null },
  ],
};
