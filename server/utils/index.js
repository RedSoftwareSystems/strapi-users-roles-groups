"use strict";

import sanitize from "./sanitize";

/**
 * Returns the plugin service with the given name
 *
 * @param {string} name - The service name
 * @returns {import("./index.d.ts").getService}
 */
const getService = (name) => {
  return strapi.plugin("users-permissions").service(name);
};

export default {
  getService,
  sanitize,
};
