"use strict";

/**
 * Default plugin config
 */
const config = {
  /**
   * Cb for default settigns
   * @param {Object} ctx - The callback context
   * @param {(name: string)=> string?} ctx.env - The environment variables
   * @returns
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

export default config;
