"use strict";

/**
 *
 * @param {Object} ctx
 * @param {import("nexus")} ctx.nexus
 * @returns
 */
module.exports = ({ nexus }) => {
  return nexus.objectType({
    name: "UsersPermissionsMe",

    definition(t) {
      t.nonNull.id("id");
      t.nonNull.string("username");
      t.string("email");
      t.boolean("confirmed");
      t.boolean("blocked");
      t.field("roles", { type: t.list("UsersPermissionsMeRole") });
    },
  });
};
