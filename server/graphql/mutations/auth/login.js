"use strict";

const { toPlainObject } = require("lodash/fp");

const { checkBadRequest } = require("../../utils");
const pluginId = require("../../../pluginId");

module.exports = ({ nexus, strapi }) => {
  const { nonNull } = nexus;

  return {
    type: nonNull("UsersPermissionsLoginPayload"),

    args: {
      input: nonNull("UsersPermissionsLoginInput"),
    },

    async resolve(parent, args, context) {
      const { koaContext } = context;

      koaContext.params = { provider: args.input.provider };
      koaContext.request.body = toPlainObject(args.input);

      await strapi.plugin(pluginId).controller("auth").callback(koaContext);

      const output = koaContext.body;

      checkBadRequest(output);

      return {
        user: output.user || output,
        jwt: output.jwt,
      };
    },
  };
};
