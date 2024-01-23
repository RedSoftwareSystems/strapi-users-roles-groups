"use strict";

/**
 * @typedef {Object} PluginConfig
 */

/**
 * Default plugin config
 */
const config = {
  /**
   * Cb for default settigns
   * @param {Object} ctx - The callback context
   * @param {function} ctx.env - The environment variables
   * @returns {PluginConfig}
   */
  default: ({ env }) => ({
    jwtSecret: env("JWT_SECRET") || "",
    jwt: {
      expiresIn: "30d",
    },
    ratelimit: {
      interval: 60000,
      max: 10,
    },
    layout: {
      user: {
        actions: {
          create: "contentManagerUser.create", // Use the User plugin's controller.
          update: "contentManagerUser.update",
        },
      },
    },
  }),
  validator() {},
};

module.exports = config;
