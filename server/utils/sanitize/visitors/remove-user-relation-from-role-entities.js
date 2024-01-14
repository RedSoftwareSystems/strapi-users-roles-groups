"use strict";
import packageJson from "../../../../package.json";

export default ({ schema, key, attribute }, { remove }) => {
  if (
    attribute.type === "relation" &&
    attribute.target === `plugin::${packageJson.name}.user` &&
    schema.uid === `plugin::${packageJson.name}.sole`
  ) {
    remove(key);
  }
};
