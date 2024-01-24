"use strict";
const fs = require("fs");
const path = require("path");

const authStrategy = require("./strategies/users-permissions");
const sanitizers = require("./utils/sanitize/sanitizers");
const pluginId = require("./pluginId");

/**
 * Strapi register callback
 *
 * @param {Object} ctx - The Bootstrap cb context
 * @param {import("@strapi/types").Strapi} ctx.strapi - The Strapi object.
 *
 */
const register = ({ strapi }) => {
  const permissionChecker = strapi.service(
    "plugin::content-manager.permission-checker"
  );
  const oldPermissionCheckerCreate = permissionChecker.create;

  permissionChecker.create = (abilityAndModel) => {
    const { userAbility, model } = abilityAndModel;
    const permissionChecker = oldPermissionCheckerCreate(abilityAndModel);
    if (model === `plugin::${pluginId}.role`) {
      const rolePermissionChecker = permissionChecker;
      const userPermissionChecker = oldPermissionCheckerCreate({
        userAbility,
        model: `plugin::${pluginId}.user`,
      });
      rolePermissionChecker.cannot.read = () => {
        return !userPermissionChecker.can.read();
      };
    }

    return permissionChecker;
  };

  strapi.container.get("auth").register("content-api", authStrategy);
  strapi.sanitizers.add("content-api.output", sanitizers.defaultSanitizeOutput);

  if (strapi.plugin("graphql")) {
    require("./graphql")({ strapi });
  }

  if (strapi.plugin("documentation")) {
    const documentationConfig = strapi.config.get("plugin.documentation");
    if (!documentationConfig["x-strapi-config"]) {
      documentationConfig["x-strapi-config"] = ["upload"];
    }
    const specPath = path.join(__dirname, "../documentation/content-api.yaml");
    const spec = fs.readFileSync(specPath, "utf8");

    strapi
      .plugin("documentation")
      .service("override")
      .registerOverride(spec, {
        pluginOrigin: pluginId,
        excludeFromGeneration: [pluginId, "users-permissions"],
      });
  }
};

module.exports = register;
