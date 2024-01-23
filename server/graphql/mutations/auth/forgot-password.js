"use strict";

const { toPlainObject } = require("lodash/fp");

const { checkBadRequest } = require("../../utils");
const pluginId = require("../../../pluginId");

module.exports = ({ nexus, strapi }) => {
  const { nonNull } = nexus;

  return {
    type: "UsersPermissionsPasswordPayload",

    args: {
      email: nonNull("String"),
    },

    description: "Request a reset password token",

    async resolve(parent, args, context) {
      const { koaContext } = context;

      koaContext.request.body = toPlainObject(args);

      await strapi
        .plugin(pluginId)
        .controller("auth")
        .forgotPassword(koaContext);

      const output = koaContext.body;

      checkBadRequest(output);

      return {
        ok: output.ok || output,
      };
    },
  };
};
