"use strict";

const pluginId = require("../../pluginId");

module.exports = {
  collectionName: "eup_roles",
  info: {
    name: "role",
    description: "",
    singularName: "role",
    pluralName: "roles",
    displayName: "Role",
    mainField: "name",
  },
  pluginOptions: {
    "content-manager": {
      visible: false,
    },
    "content-type-builder": {
      visible: false,
    },
  },
  attributes: {
    name: {
      type: "string",
      minLength: 3,
      required: true,
      configurable: false,
    },
    description: {
      type: "string",
      configurable: false,
    },
    type: {
      type: "string",
      unique: true,
      configurable: false,
    },
    permissions: {
      type: "relation",
      relation: "oneToMany",
      target: `plugin::${pluginId}.permission`,
      mappedBy: "role",
      configurable: false,
    },
    users: {
      type: "relation",
      relation: "manyToMany",
      target: `plugin::${pluginId}.user`,
      inversedBy: "roles",
      configurable: false,
    },
  },
};
