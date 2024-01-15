"use strict";
const packageJson = require("../../../../package.json");

module.exports = ({ schema, key, attribute }, { remove }) => {
  if (
    attribute.type === "relation" &&
    attribute.target === `plugin::${packageJson.strapi.name}.user` &&
    schema.uid === `plugin::${packageJson.strapi.name}.role`
  ) {
    remove(key);
  }
};
