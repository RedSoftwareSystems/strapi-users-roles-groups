"use strict";

/**
 * @module services/jwt
 */

/** @typedef {import("jsonwebtoken")} JWT */

/**
 * Jwt.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */
const jwt = require("jsonwebtoken");
const pluginId = require("../pluginId");

module.exports = ({ strapi }) => ({
  /**
   * Returns a parsed and verified jwt token or null
   *
   * @param {import("@types/koa").BaseContext} ctx
   * @returns {Promise<import("@types/jsonwebtoken").Jwt | null>}
   *
   */
  getToken(ctx) {
    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const parts = ctx.request.header.authorization.split(/\s+/);

      if (parts[0].toLowerCase() !== "bearer" || parts.length !== 2) {
        return null;
      }

      const token = parts[1];
      return this.verify(token);
    } else {
      return null;
    }
  },

  /**
   * Issues the JWT given a payload
   *
   * @param {string | Buffer | Object} payload
   * @param {import("jsonwebtoken").SignOptions} jwtOptions
   * @returns {string}
   */
  issue(payload, jwtOptions = {}) {
    return jwt.sign(
      payload,
      strapi.config.get(`plugin.${pluginId}.jwtSecret`),
      {
        ...algorithm(strapi.config.get(`plugin.${pluginId}.jwt`)),
        ...jwtOptions,
      }
    );
  },

  /**
   * Verifies given token using a secret or a public key to get a decoded token
   *
   * @param {string} token - the token to be verified
   * @returns {Promise<JWT.Jwt | JWT.JwtPayload | string>}
   */
  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        strapi.config.get(`plugin.${pluginId}.jwtSecret`),
        {},
        (err, tokenPayload = {}) => {
          if (err) {
            return reject(new Error("Invalid token."));
          }
          resolve(tokenPayload);
        }
      );
    });
  },
});
