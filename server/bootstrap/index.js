"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 */

const pluginId = require("../pluginId");
const urljoin = require("url-join");

const { getService } = require("../utils");
const getGrantConfig = require("../config/grant-config");

const usersPermissionsActions = require("./users-permissions-actions");
const userSchema = require("../content-types/user");

/**
 * Inits grant providers.
 *
 * @param {import("@strapi/types").CoreStore} pluginStore
 */
const initGrant = async (pluginStore) => {
  const apiPrefix = strapi.config.get("api.rest.prefix");
  const baseURL = urljoin(strapi.config.server.url, apiPrefix, "auth");

  const grantConfig = getGrantConfig(baseURL);

  const prevGrantConfig = (await pluginStore.get({ key: "grant" })) || {};
  // store grant auth config to db
  // when plugin_users-permissions_grant is not existed in db
  // or we have added/deleted provider here.

  if (JSON.stringify(prevGrantConfig) !== JSON.stringify(grantConfig)) {
    await pluginStore.set({
      key: "grant",
      value: { ...prevGrantConfig, ...grantConfig },
    });
  }
};

/**
 * Inits plugin email templates properties if not found in Strapi store.
 *
 * @param {import("@strapi/types").CoreStore} pluginStore
 */
const initEmails = async (pluginStore) => {
  if (!(await pluginStore.get({ key: "email" }))) {
    const value = {
      reset_password: {
        display: "Email.template.reset_password",
        icon: "sync",
        options: {
          from: {
            name: "Administration Panel",
            email: "no-reply@strapi.io",
          },
          response_email: "",
          object: "Reset password",
          message: `<p>We heard that you lost your password. Sorry about that!</p>

<p>But don’t worry! You can use the following link to reset your password:</p>
<p><%= URL %>?code=<%= TOKEN %></p>

<p>Thanks.</p>`,
        },
      },
      email_confirmation: {
        display: "Email.template.email_confirmation",
        icon: "check-square",
        options: {
          from: {
            name: "Administration Panel",
            email: "no-reply@strapi.io",
          },
          response_email: "",
          object: "Account confirmation",
          message: `<p>Thank you for registering!</p>

<p>You have to confirm your email address. Please click on the link below.</p>

<p><%= URL %>?confirmation=<%= CODE %></p>

<p>Thanks.</p>`,
        },
      },
    };

    await pluginStore.set({ key: "email", value });
  }
};

/**
 * Inits plugin advanced properties if not found in Strapi store.
 *
 * @param {import("@strapi/types").CoreStore} pluginStore
 */
const initAdvancedOptions = async (pluginStore) => {
  if (!(await pluginStore.get({ key: "advanced" }))) {
    const value = {
      unique_email: true,
      allow_register: true,
      email_confirmation: false,
      email_reset_password: null,
      email_confirmation_redirection: null,
      default_role: "authenticated",
    };

    await pluginStore.set({ key: "advanced", value });
  }
};

/**
 * User Schema added field names
 *
 * @returns {string[]}
 */
const userSchemaAdditions = () => {
  const defaultSchema = Object.keys(userSchema.attributes);
  const currentSchema = Object.keys(
    strapi.contentTypes[`plugin::${pluginId}.user`].attributes
  );

  // Some dynamic fields may not have been initialized yet, so we need to ignore them
  // TODO: we should have a global method for finding these
  const ignoreDiffs = [
    "createdBy",
    "createdAt",
    "updatedBy",
    "updatedAt",
    "publishedAt",
    "strapi_stage",
    "strapi_assignee",
  ];

  return currentSchema.filter(
    (key) => !(ignoreDiffs.includes(key) || defaultSchema.includes(key))
  );
};

/**
 * Bootstrap Cb for Strapi Server plugin
 *
 * @param {Object} ctx - The Bootstrap cb context
 * @param {import("@strapi/types").Strapi} ctx.strapi - The Strapi object.
 *
 * @returns {Promise<void>}
 */
const bootstrapCb = async ({ strapi }) => {
  let crypto;
  try {
    crypto = await import("node:crypto");
  } catch (err) {
    console.error("crypto support is disabled!");
  }

  const pluginStore = strapi.store({
    type: "plugin",
    name: pluginId,
  });

  await initGrant(pluginStore);
  await initEmails(pluginStore);
  await initAdvancedOptions(pluginStore);

  await strapi.admin.services.permission.actionProvider.registerMany(
    usersPermissionsActions.actions
  );

  await getService("users-permissions").initialize();

  if (!strapi.config.get(`plugin.${pluginId}.jwtSecret`)) {
    if (process.env.NODE_ENV !== "development") {
      throw new Error(
        `Missing jwtSecret. Please, set configuration variable "jwtSecret" for the ${pluginId} plugin in config/plugins.js (ex: you can generate one using Node with \`crypto.randomBytes(16).toString('base64')\`).
For security reasons, prefer storing the secret in an environment variable and read it in config/plugins.js. See https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/environment.html#configuration-using-environment-variables.`
      );
    }

    const jwtSecret = crypto.randomBytes(16).toString("base64");

    strapi.config.set(`plugin.${pluginId}.jwtSecret`, jwtSecret);

    if (!process.env.JWT_SECRET) {
      const envPath = process.env.ENV_PATH || ".env";
      strapi.fs.appendFile(envPath, `JWT_SECRET=${jwtSecret}\n`);
      strapi.log.info(
        `The Users & Permissions plugin automatically generated a jwt secret and stored it in ${envPath} under the name JWT_SECRET.`
      );
    }
  }

  // TODO v5: Remove this block of code and default allowedFields to empty array
  if (strapi.config.get(`plugin.${pluginId}.register.allowedFields`)?.entries) {
    const modifications = userSchemaAdditions();
    if (modifications.length) {
      // if there is a potential vulnerability, show a warning
      strapi.log.warn(
        `${
          pluginId.ca
        } registration has defaulted to accepting the following additional user fields during registration: ${modifications.join(
          ","
        )}`
      );
    }
  }
};

module.exports = bootstrapCb;
