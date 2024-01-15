"use strict";

const register = require("./register");
const bootstrap = require("./bootstrap");
const contentTypes = require("./content-types");
const middlewares = require("./middlewares");
const services = require("./services");
const routes = require("./routes");
const controllers = require("./controllers");
const config = require("./config");

/**
 * Cb that returns the Server API
 *
 * @returns {import("@strapi/types").Strapi}
 */
const cb = () => ({
  register,
  bootstrap,
  config,
  routes,
  controllers,
  contentTypes,
  middlewares,
  services,
});

module.exports = cb;
