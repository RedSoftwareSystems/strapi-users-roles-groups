"use strict";

/**
 * @module services/user
 *
 */

/**
 * @typedef {import("../types/entries").User} User
 * @typedef {import("@strapi/types").EntityService.Params} Params
 */

const pluginName = require("../pluginId");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const urlJoin = require("url-join");

const {
  getAbsoluteAdminUrl,
  getAbsoluteServerUrl,
  sanitize,
} = require("@strapi/utils");
const { getService } = require("../utils");

/**
 * Users service callback
 *
 * @param {Object} ctx
 * @param {import("@strapi/types").Strapi} ctx.strapi
 */
module.exports = ({ strapi }) => ({
  /**
   * Counts users
   *
   * @param {Params} params - WhereParams for the query engine @see https://docs.strapi.io/dev-docs/api/query-engine/filtering/
   * @return {Promise<number>}
   */
  count(params) {
    return strapi.query(`plugin::${pluginName}.user`).count({ where: params });
  },

  /**
   * Adds a user along with his roles.
   * @param {User} values - Input data
   * @return {Promise<User>}
   */
  async add(values) {
    return strapi.entityService.create(`plugin::${pluginName}.user`, {
      data: values,
      populate: ["roles"],
    });
  },

  /**
   * Promise to edit a user.
   *
   * @param {number} userId - The user entity id
   * @param {User} params - The user input data
   * @return {Promise<User>}
   */
  async edit(userId, params = {}) {
    return strapi.entityService.update(`plugin::${pluginName}.user`, userId, {
      data: params,
      populate: ["roles"],
    });
  },

  /**
   * Promise to fetch a user.
   *
   * @param {number} id - The user entity id
   * @param {Params} params - Params to extract @see https://docs.strapi.io/dev-docs/api/entity-service/crud#findone
   *
   * @return {Promise<User>}
   */
  async fetch(id, params) {
    return strapi.entityService.findOne(
      `plugin::${pluginName}.user`,
      id,
      params
    );
  },

  /**
   * Promise to fetch authenticated user (with roles).
   *
   * @param {number} id - The user entity id
   * @return {Promise<User>}
   */
  async fetchAuthenticatedUser(id) {
    return strapi
      .query(`plugin::${pluginName}.user`)
      .findOne({ where: { id }, populate: ["roles"] });
  },

  /**
   * Promise to fetch all users.
   *
   * @param {Params} params - Entity service params @see https://docs.strapi.io/dev-docs/api/entity-service/crud#findmany
   *
   * @return {Promise<User[]>}
   */
  async fetchAll(params) {
    return strapi.entityService.findMany(`plugin::${pluginName}.user`, params);
  },

  /**
   * Promise to fetch all users paging the result.
   *
   * @param {Params} params - Entity service params @see https://docs.strapi.io/dev-docs/api/entity-service/crud#findpage
   *
   * @return {Promise<import("@strapi/types").EntityService.PaginatedResult<*>>}
   */
  async fetchPage(params) {
    return strapi.entityService.findPage(`plugin::${pluginName}.user`, params);
  },

  /**
   * Promise to remove a user.
   *  @param {Params} params -  @see https://docs.strapi.io/dev-docs/api/query-engine/single-operations#delete
   *  @return {User}
   */
  async remove(params) {
    return strapi.query(`plugin::${pluginName}.user`).delete({ where: params });
  },

  /**
   * Validates a plain text password against its hashed version
   *
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @return {Promise<boolean>} - true when matches
   */
  async validatePassword(password, hash) {
    return bcrypt.compare(password, hash);
  },

  /**
   * Sends a confirmation email to the user and updates the relative
   * confirmation token
   *
   * @param {User} user
   * @returns {Promise<void>}
   */
  async sendConfirmationEmail(user) {
    const userPermissionService = getService("users-permissions");
    const pluginStore = await strapi.store({
      type: "plugin",
      name: pluginName,
    });
    const userSchema = strapi.getModel(`plugin::${pluginName}.user`);

    const settings = await pluginStore
      .get({ key: "email" })
      .then((storeEmail) => storeEmail.email_confirmation.options);

    // Sanitize the template's user information
    const sanitizedUserInfo = await sanitize.sanitizers.defaultSanitizeOutput(
      userSchema,
      user
    );

    const confirmationToken = crypto.randomBytes(20).toString("hex");

    await this.edit(user.id, { confirmationToken });

    const apiPrefix = strapi.config.get("api.rest.prefix");

    try {
      settings.message = await userPermissionService.template(
        settings.message,
        {
          URL: urlJoin(
            getAbsoluteServerUrl(strapi.config),
            apiPrefix,
            "/auth/email-confirmation"
          ),
          SERVER_URL: getAbsoluteServerUrl(strapi.config),
          ADMIN_URL: getAbsoluteAdminUrl(strapi.config),
          USER: sanitizedUserInfo,
          CODE: confirmationToken,
        }
      );

      settings.object = await userPermissionService.template(settings.object, {
        USER: sanitizedUserInfo,
      });
    } catch {
      strapi.log.error(
        `[plugin::${pluginName}.sendConfirmationEmail]: Failed to generate a template for "user confirmation email". Please make sure your email template is valid and does not contain invalid characters or patterns`
      );
      return;
    }

    // Send an email to the user.
    await strapi
      .plugin("email")
      .service("email")
      .send({
        to: user.email,
        from:
          settings.from.email && settings.from.name
            ? `${settings.from.name} <${settings.from.email}>`
            : undefined,
        replyTo: settings.response_email,
        subject: settings.object,
        text: settings.message,
        html: settings.message,
      });
  },
});
