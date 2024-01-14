"use strict";
import fs from "fs/promises";
import path from "path";

import authStrategy from "./strategies/users-permissions";
import sanitizers from "./utils/sanitize/sanitizers";

/**
 * Strapi register callback
 *
 * @param {Object} ctx - The Bootstrap cb context
 * @param {import("@strapi/types").Strapi} ctx.strapi - The Strapi object.
 *
 */
const register = ({ strapi }) => {
  strapi.container.get("auth").register("content-api", authStrategy);
  strapi.sanitizers.add("content-api.output", sanitizers.defaultSanitizeOutput);

  if (strapi.plugin("graphql")) {
    import("./graphql").then((graphql) => graphql({ strapi }));
  }

  if (strapi.plugin("documentation")) {
    const specPath = path.join(__dirname, "../documentation/content-api.yaml");
    const spec = fs.readFileSync(specPath, "utf8");

    strapi
      .plugin("documentation")
      .service("override")
      .registerOverride(spec, {
        pluginOrigin: "users-permissions",
        excludeFromGeneration: ["users-permissions"],
      });
  }
};

export default register;
