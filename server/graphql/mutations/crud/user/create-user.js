"use strict";

const { toPlainObject } = require("lodash/fp");

const { checkBadRequest } = require("../../../utils");
const pluginId = require("../../../../pluginId");

const usersPermissionsUserUID = `plugin::${pluginId}.user`;

module.exports = ({ nexus, strapi }) => {
  const { nonNull } = nexus;
  const { getContentTypeInputName, getEntityResponseName } = strapi
    .plugin("graphql")
    .service("utils").naming;

  const userContentType = strapi.getModel(usersPermissionsUserUID);

  const userInputName = getContentTypeInputName(userContentType);
  const responseName = getEntityResponseName(userContentType);

  return {
    type: nonNull(responseName),

    args: {
      data: nonNull(userInputName),
    },

    description: "Create a new user",

    async resolve(parent, args, context) {
      const { koaContext } = context;

      koaContext.params = {};
      koaContext.request.body = toPlainObject(args.data);

      await strapi.plugin(pluginId).controller("user").create(koaContext);

      checkBadRequest(koaContext.body);

      return {
        value: koaContext.body,
        info: { args, resourceUID: `plugin:${pluginId}.user` },
      };
    },
  };
};
