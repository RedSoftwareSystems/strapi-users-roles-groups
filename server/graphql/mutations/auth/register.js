"use strict";

const { toPlainObject } = require("lodash/fp");

const { checkBadRequest } = require("../../utils");
const pluginId = require("../../../pluginId");

module.exports = ({ nexus, strapi }) => {
  const { nonNull } = nexus;

  return {
    type: nonNull("UsersPermissionsLoginPayload"),

    args: {
      input: nonNull("UsersPermissionsRegisterInput"),
    },

    description: "Register a user",

    async resolve(parent, args, context) {
      const { koaContext } = context;

      koaContext.request.body = toPlainObject(args.input);

      await strapi.plugin(pluginId).controller("auth").register(koaContext);

      const output = koaContext.body;

      checkBadRequest(output);

      return {
        user: output.user || output,
        jwt: output.jwt,
      };
    },
  };
};
