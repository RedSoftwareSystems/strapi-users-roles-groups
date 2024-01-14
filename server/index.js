"use strict";

import register from "./register";
import bootstrap from "./bootstrap";
import contentTypes from "./content-types";
import middlewares from "./middlewares";
import services from "./services";
import routes from "./routes";
import controllers from "./controllers";
import config from "./config";

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

export default cb;
