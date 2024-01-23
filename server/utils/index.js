"use strict";

const pluginId = require("../pluginId.js");
const sanitize = require("./sanitize");

/**
 * Returns the plugin service with the given name
 *
 * @param {string} name - The service name
 * @returns {import("./index.d.ts").getService}
 */
const getService = (name) => {
  return strapi.plugin(pluginId).service(name);
};

module.exports = {
  getService,
  sanitize,
};
