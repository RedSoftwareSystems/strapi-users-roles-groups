"use strict";

import { curry } from "../fp";
import { traverseEntity, pipeAsync } from "@strapi/utils";

import { removeUserRelationFromRoleEntities } from "./visitors";

export const sanitizeUserRelationFromRoleEntities = curry((schema, entity) => {
  return traverseEntity(removeUserRelationFromRoleEntities, { schema }, entity);
});

export const defaultSanitizeOutput = curry((schema, entity) => {
  return pipeAsync(sanitizeUserRelationFromRoleEntities(schema))(entity);
});
