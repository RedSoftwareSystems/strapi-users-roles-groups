"use strict";

const { toPlainObject } = require("lodash/fp");
const pluginId = require("../../../../pluginId");

const usersPermissionsRoleUID = `plugin::${pluginId}.role`;

module.exports = ({ nexus, strapi }) => {
  const { getContentTypeInputName } = strapi
    .plugin("graphql")
    .service("utils").naming;
  const { nonNull } = nexus;

  const roleContentType = strapi.getModel(usersPermissionsRoleUID);

  const roleInputName = getContentTypeInputName(roleContentType);

  return {
    type: "UsersPermissionsCreateRolePayload",

    args: {
      data: nonNull(roleInputName),
    },

    description: "Create a new role",

    async resolve(parent, args, context) {
      const { koaContext } = context;

      koaContext.request.body = toPlainObject(args.data);

      await strapi.plugin(pluginId).controller("role").createRole(koaContext);

      return { ok: true };
    },
  };
};
