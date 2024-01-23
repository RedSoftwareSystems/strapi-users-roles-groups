"use strict";

const pluginId = require("../../pluginId");

module.exports = [
  {
    method: "GET",
    path: "/roles/:id",
    handler: "role.findOne",
    config: {
      policies: [
        {
          name: "admin::hasPermissions",
          config: {
            actions: [`plugin::${pluginId}.roles.read`],
          },
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/roles",
    handler: "role.find",
    config: {
      policies: [
        {
          name: "admin::hasPermissions",
          config: {
            actions: [`plugin::${pluginId}.roles.read`],
          },
        },
      ],
    },
  },
  {
    method: "POST",
    path: "/roles",
    handler: "role.createRole",
    config: {
      policies: [
        {
          name: "admin::hasPermissions",
          config: {
            actions: [`plugin::${pluginId}.roles.create`],
          },
        },
      ],
    },
  },
  {
    method: "PUT",
    path: "/roles/:role",
    handler: "role.updateRole",
    config: {
      policies: [
        {
          name: "admin::hasPermissions",
          config: {
            actions: [`plugin::${pluginId}.roles.update`],
          },
        },
      ],
    },
  },
  {
    method: "DELETE",
    path: "/roles/:role",
    handler: "role.deleteRole",
    config: {
      policies: [
        {
          name: "admin::hasPermissions",
          config: {
            actions: [`plugin::${pluginId}.roles.delete`],
          },
        },
      ],
    },
  },
];
