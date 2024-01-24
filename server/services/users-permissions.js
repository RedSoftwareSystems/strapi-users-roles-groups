"use strict";

/**
 * @module services/users-permissions
 */

require("core-js/actual/set");
const pluginName = require("../pluginId");

const _template = require("lodash").template;
const _ = require("lodash");

const urlJoin = require("url-join");

const {
  template: { createStrictInterpolationRegExp },
  errors,
  keysDeep,
} = require("@strapi/utils");

const { getService } = require("../utils");
const { Common } = require("@strapi/strapi");
const pluginId = require("../pluginId");

/**
 * @typedef {Object} Permission
 *
 * @property {string} action - Action name to apply the permission
 * @property {string} roleType - Role type for the permission
 *
 * @example
 * { action: "plugin::plugin-name.route.path", roleType: "public" }
 */

/**
 * @typedef {import("../types/entries.d.ts").CoreEntity} Entity
 */

/**
 * @typedef {import("../types/entries.d.ts").User} User
 */

/**
 * @typedef {import("@strapi/types").Common} Common
 */

/**
 * @typedef {import("@strapi/types").Strapi} Strapi
 */

/**
 * @constant {Permission[]} - definition of public actions
 */
const DEFAULT_PERMISSIONS = [
  {
    action: `plugin::${pluginName}.auth.callback`,
    roleType: "public",
  },
  {
    action: `plugin::${pluginName}.auth.connect`,
    roleType: "public",
  },
  {
    action: `plugin::${pluginName}.auth.forgotPassword`,
    roleType: "public",
  },
  {
    action: `plugin::${pluginName}.auth.resetPassword`,
    roleType: "public",
  },
  {
    action: `plugin::${pluginName}.auth.register`,
    roleType: "public",
  },
  {
    action: `plugin::${pluginName}.auth.emailConfirmation`,
    roleType: "public",
  },
  {
    action: `plugin::${pluginName}.auth.sendEmailConfirmation`,
    roleType: "public",
  },
  {
    action: `plugin::${pluginName}.user.me`,
    roleType: "authenticated",
  },
  {
    action: `plugin::${pluginName}.auth.changePassword`,
    roleType: "authenticated",
  },
];

const transformRoutePrefixFor = (pluginName) => (route) => {
  const prefix = route.config && route.config.prefix;
  const path =
    prefix !== undefined
      ? `${prefix}${route.path}`
      : `/${pluginName}${route.path}`;

  return {
    ...route,
    path,
  };
};

/**
 * Fixes the route path with the
 *  provided route.config.prefix or rhw plugin name if the first parameter is undefined
 *
 * @param {Common.Route} route
 * @returns {Common.Route}
 */
const transformRoutePrefix = (route) => {
  return {
    ...route,
    path: `${route.config?.prefix || `/${pluginName}`}${route.path}`,
  };
};

/**
 * @typedef {Object} ControllerPolicy
 * @property {boolean} enabled
 * @property {String} policy
 */

/**
 *
 * @param {Object} ctx
 * @param {Strapi} ctx.strapi
 */
module.exports = ({ strapi }) => ({
  /**
   * Strapi APIs and plugins routes
   *
   * @returns {Promise<Record<string, Common.Route>>}
   */
  async getRoutes() {
    const apiPrefix = strapi.config.get("api.rest.prefix");

    /**
     * @type {Record<string, Common.Route[]>}
     */
    const apiRoutes = Object.entries(strapi.api).reduce(
      (acc, [apiName, module]) => ({
        ...acc,
        [`api::${apiName}`]: Object.values(module.routes)
          .flatMap((route) => route.routes || route)
          .filter((route) => route?.info?.type === "content-api")
          .map((route) => ({
            ...route,
            path: urlJoin(apiPrefix, route.path),
          })),
      }),
      {}
    );
    /**
     * @type {Record<string, Common.Route[]>}
     */
    const pluginsRoutes = Object.entries(strapi.plugins).reduce(
      (acc, [pluginName, module]) => {
        return {
          ...acc,
          [`plugin::${pluginName}`]: Object.values(module.routes)
            .flatMap((route) => {
              return (
                route.routes?.map(transformRoutePrefix) ||
                transformRoutePrefix(route)
              );
            })
            .filter((route) => route?.info?.type === "content-api")
            .map((route) => ({
              ...route,
              path: urlJoin(apiPrefix, route.path),
            })),
        };
      },
      {}
    );

    return { ...apiRoutes, ...pluginsRoutes };
  },

  /**
   * Returns the content/type controllers policy for api and plugins
   *
   * @param {boolean} defaultEnable
   * @returns {Record<string, Record<string, ControllerPolicy>>}
   */
  getActions({ defaultEnable = false } = {}) {
    const actionMap = {};

    const isContentApi = (action) => {
      if (!_.has(action, Symbol.for("__type__"))) {
        return false;
      }

      return action[Symbol.for("__type__")].includes("content-api");
    };

    _.forEach(strapi.api, (api, apiName) => {
      const controllers = _.reduce(
        api.controllers,
        (acc, controller, controllerName) => {
          const contentApiActions = _.pickBy(controller, isContentApi);

          if (_.isEmpty(contentApiActions)) {
            return acc;
          }

          acc[controllerName] = _.mapValues(contentApiActions, () => {
            return {
              enabled: defaultEnable,
              policy: "",
            };
          });

          return acc;
        },
        {}
      );

      if (!_.isEmpty(controllers)) {
        actionMap[`api::${apiName}`] = { controllers };
      }
    });

    _.forEach(strapi.plugins, (plugin, pluginName) => {
      const controllers = _.reduce(
        plugin.controllers,
        (acc, controller, controllerName) => {
          const contentApiActions = _.pickBy(controller, isContentApi);

          if (_.isEmpty(contentApiActions)) {
            return acc;
          }

          acc[controllerName] = _.mapValues(contentApiActions, () => {
            return {
              enabled: defaultEnable,
              policy: "",
            };
          });

          return acc;
        },
        {}
      );

      if (!_.isEmpty(controllers)) {
        actionMap[`plugin::${pluginName}`] = { controllers };
      }
    });

    return actionMap;
  },

  async getRoutesOld() {
    const routesMap = {};

    _.forEach(strapi.api, (api, apiName) => {
      const routes = _.flatMap(api.routes, (route) => {
        if (_.has(route, "routes")) {
          return route.routes;
        }

        return route;
      }).filter((route) => route.info.type === "content-api");

      if (routes.length === 0) {
        return;
      }

      const apiPrefix = strapi.config.get("api.rest.prefix");
      routesMap[`api::${apiName}`] = routes.map((route) => ({
        ...route,
        path: urlJoin(apiPrefix, route.path),
      }));
    });

    _.forEach(strapi.plugins, (plugin, pluginName) => {
      const transformPrefix = transformRoutePrefixFor(pluginName);

      const routes = _.flatMap(plugin.routes, (route) => {
        if (_.has(route, "routes")) {
          return route.routes.map(transformPrefix);
        }

        return transformPrefix(route);
      }).filter((route) => route.info.type === "content-api");

      if (routes.length === 0) {
        return;
      }

      const apiPrefix = strapi.config.get("api.rest.prefix");
      routesMap[`plugin::${pluginName}`] = routes.map((route) => ({
        ...route,
        path: urlJoin(apiPrefix, route.path),
      }));
    });

    return routesMap;
  },

  /**
   * Synchronization to ensures that permission entity
   * contains only valid data and that all the default permissions are present
   *
   * @returns {Promise<void>}
   */
  async syncPermissions() {
    const roles = await strapi.query(`plugin::${pluginId}.role`).findMany();
    const dbPermissions = await strapi
      .query(`plugin::${pluginId}.permission`)
      .findMany();

    const permissionsFoundInDB = new Set(dbPermissions.map((p) => p.action));

    const appActions = Object.entries(strapi.api).flatMap(([apiName, api]) =>
      Object.entries(api.controllers).flatMap(([controllerName, controller]) =>
        Object.keys(controller).map(
          (actionName) => `api::${apiName}.${controllerName}.${actionName}`
        )
      )
    );
    const pluginsActions = Object.entries(strapi.plugins).flatMap(
      ([pluginName, plugin]) =>
        Object.entries(plugin.controllers).flatMap(
          ([controllerName, controller]) =>
            Object.keys(controller).map(
              (actionName) =>
                `plugin::${pluginName}.${controllerName}.${actionName}`
            )
        )
    );

    const allActions = new Set([...appActions, ...pluginsActions]);

    const toDelete = [...permissionsFoundInDB.difference(allActions)];

    // clean "permission" removing
    // permissions no more present in app or plugins
    await strapi
      .query(`plugin::${pluginId}.permission`)
      .deleteMany({ where: { action: { $in: toDelete } } });

    if (!permissionsFoundInDB.size) {
      // create default permissions
      for (const role of roles) {
        const permissionsToCreate = DEFAULT_PERMISSIONS.filter(
          ({ roleType }) => roleType === null || roleType === role.type
        ).map(({ action }) => ({
          action,
          role: role.id,
        }));

        await Promise.all(
          permissionsToCreate.map((data) => {
            return strapi.query(`plugin::${pluginId}.permission`).create({
              data,
            });
          })
        );
      }
    }
  },

  /**
   * Initializes and synchronizes "role" entities
   *
   * @returns {Promise<void>}
   */
  async initialize() {
    const roleCount = await strapi.query(`plugin::${pluginId}.role`).count();

    if (roleCount === 0) {
      await strapi.query(`plugin::${pluginId}.role`).create({
        data: {
          name: "Authenticated",
          description: "Default role given to authenticated user.",
          type: "authenticated",
        },
      });

      await strapi.query(`plugin::${pluginId}.role`).create({
        data: {
          name: "Public",
          description: "Default role given to unauthenticated user.",
          type: "public",
        },
      });
    }

    return getService("users-permissions").syncPermissions();
  },

  /**
   * Update roles for a given user
   *
   * @param {Entity} user
   * @param {Entity[]} roles
   * @return {Promise<User>}
   */
  async updateUserRoles(user, roles) {
    return strapi.query(`plugin::${pluginId}.user`).update({
      where: { id: user.id },
      data: { roles: roles.map((role) => role.id) },
    });
  },

  /**
   * Uses Lodash template syntax to generate emails body
   * see https://lodash.com/docs/4.17.15#template
   *
   * @param {string} layout - Lodash template syntax string
   * @param {Record<string, unknown>} data - data to interpolate with the template
   * @returns {string}
   */
  template(layout, data) {
    const allowedTemplateVariables = keysDeep(data);

    // Create a strict interpolation RegExp based on possible variable names
    const interpolate = createStrictInterpolationRegExp(
      allowedTemplateVariables,
      "g"
    );

    try {
      return _template(layout, {
        interpolate,
        evaluate: false,
        escape: false,
      })(data);
    } catch (e) {
      throw new errors.ApplicationError("Invalid email template");
    }
  },
});
