"use strict";

const _ = require("lodash");
const { getService } = require("../utils");
const pluginId = require("../pluginId");

module.exports = {
  async getPermissions(ctx) {
    const permissions = await getService("users-permissions").getActions();

    ctx.send({ permissions });
  },

  async getPolicies(ctx) {
    const policies = _.keys(strapi.plugin(pluginId).policies);

    ctx.send({
      policies: _.without(policies, "permissions"),
    });
  },

  async getRoutes(ctx) {
    const routes = await getService("users-permissions").getRoutes();

    ctx.send({ routes });
  },
};
