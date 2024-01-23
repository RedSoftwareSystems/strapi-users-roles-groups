// NOTE TO PLUGINS DEVELOPERS:
// If you modify this file by adding new options to the plugin entry point
// Here's the file: strapi/docs/3.0.0-beta.x/plugin-development/frontend-field-api.md
// Here's the file: strapi/docs/3.0.0-beta.x/guides/registering-a-field-in-admin.md
// Also the strapi-generate-plugins/files/admin/src/index.js needs to be updated
// IF THE DOC IS NOT UPDATED THE PULL REQUEST WILL NOT BE MERGED
import { prefixPluginTranslations } from "@strapi/helper-plugin";

import { PERMISSIONS } from "./constants";
import getTrad from "./utils/getTrad";
import pluginId from "./pluginId";

export default {
  register(app) {
    // Create the plugin's settings section
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: getTrad("Settings.section-label"),
          defaultMessage: "Users & Permissions plugin",
        },
      },
      [
        {
          intlLabel: {
            id: "global.roles",
            defaultMessage: "Roles",
          },
          id: "roles",
          to: `/settings/${pluginId}/roles`,
          async Component() {
            const component = await import("./pages/Roles");

            return component;
          },
          permissions: PERMISSIONS.accessRoles,
        },
        {
          intlLabel: {
            id: getTrad("HeaderNav.link.providers"),
            defaultMessage: "Providers",
          },
          id: "providers",
          to: `/settings/${pluginId}/providers`,
          async Component() {
            const component = await import("./pages/Providers");

            return component;
          },
          permissions: PERMISSIONS.readProviders,
        },
        {
          intlLabel: {
            id: getTrad("HeaderNav.link.emailTemplates"),
            defaultMessage: "Email templates",
          },
          id: "email-templates",
          to: `/settings/${pluginId}/email-templates`,
          async Component() {
            const component = await import("./pages/EmailTemplates");

            return component;
          },
          permissions: PERMISSIONS.readEmailTemplates,
        },
        {
          intlLabel: {
            id: getTrad("HeaderNav.link.advancedSettings"),
            defaultMessage: "Advanced Settings",
          },
          id: "advanced-settings",
          to: `/settings/${pluginId}/advanced-settings`,
          async Component() {
            const component = await import("./pages/AdvancedSettings");

            return component;
          },
          permissions: PERMISSIONS.readAdvancedSettings,
        },
      ]
    );

    app.registerPlugin({
      id: pluginId,
      name: pluginId,
    });
  },
  bootstrap() {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
