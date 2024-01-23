"use strict";
const pluginName = require("../../../pluginId");

module.exports = ({ schema, key, attribute }, { remove }) => {
  if (
    attribute.type === "relation" &&
    attribute.target === `plugin::${pluginName}.user` &&
    schema.uid === `plugin::${pluginName}.role`
  ) {
    remove(key);
  }
};
