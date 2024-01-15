"use strict";

const sanitize = require("./sanitize");

/**
 * Returns the plugin service with the given name
 *
 * @param {string} name - The service name
 * @returns {import("./index.d.ts").getService}
 */
const getService = (name) => {
  return strapi.plugin("users-permissions").service(name);
};

module.exports = {
  getService,
  sanitize,
};
