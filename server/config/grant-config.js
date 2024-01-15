"use strict";

/**
 * The Grant provider type.
 * @typedef {Object} GrantProvider
 * @property {boolean} enable - Indicates whether the Grant provider is enabled.
 * @property {boolean} [state] - Provider is stateful
 * @property {string} [icon] - Provider icon name
 * @property {string} [key] - Provider key
 * @property {string} [secret] - Provider secret
 * @property {string} [callback] - Callback endpoint for provider
 * @property {string[]} [scope] - Provider scopes (oauth)
 * @property {string} [subdomain] - Subdomain part of the URL to replace in origin @see https://github.com/simov/purest used when the provider returns with tokens
 */

/**
 * The Default Grant providers.
 * @typedef {Object} GrantProviders
 * @property {GrantProvider} email - Basic email provider
 * @property {GrantProvider} discord 
 * @property {GrantProvider} facebook 
 * @property {GrantProvider} google 
 * @property {GrantProvider} github 
 * @property {GrantProvider} microsoft 
 * @property {GrantProvider} twitter 
 * @property {GrantProvider} instagram 
 * @property {GrantProvider} vk 
 * @property {GrantProvider} twitch 
 * @property {GrantProvider} linkedin 
 * @property {GrantProvider} cognito 
 * @property {GrantProvider} reddit 
 * @property {GrantProvider} auth0 
 * @property {GrantProvider} cas 
 * @property {GrantProvider} patreon 
 * @property {GrantProvider} keycloak 
 * /

/**
 * Grant config initiator function
 * @param {string} baseURL - Strapi Base URL for callback endpoints
 * @returns {GrantProviders}
 */
const grantConfig = (baseURL) => ({
  email: {
    enabled: true,
    icon: "envelope",
  },
  discord: {
    enabled: false,
    icon: "discord",
    key: "",
    secret: "",
    callback: `${baseURL}/discord/callback`,
    scope: ["identify", "email"],
  },
  facebook: {
    enabled: false,
    icon: "facebook-square",
    key: "",
    secret: "",
    callback: `${baseURL}/facebook/callback`,
    scope: ["email"],
  },
  google: {
    enabled: false,
    icon: "google",
    key: "",
    secret: "",
    callback: `${baseURL}/google/callback`,
    scope: ["email"],
  },
  github: {
    enabled: false,
    icon: "github",
    key: "",
    secret: "",
    callback: `${baseURL}/github/callback`,
    scope: ["user", "user:email"],
  },
  microsoft: {
    enabled: false,
    icon: "windows",
    key: "",
    secret: "",
    callback: `${baseURL}/microsoft/callback`,
    scope: ["user.read"],
  },
  twitter: {
    enabled: false,
    icon: "twitter",
    key: "",
    secret: "",
    callback: `${baseURL}/twitter/callback`,
  },
  instagram: {
    enabled: false,
    icon: "instagram",
    key: "",
    secret: "",
    callback: `${baseURL}/instagram/callback`,
    scope: ["user_profile"],
  },
  vk: {
    enabled: false,
    icon: "vk",
    key: "",
    secret: "",
    callback: `${baseURL}/vk/callback`,
    scope: ["email"],
  },
  twitch: {
    enabled: false,
    icon: "twitch",
    key: "",
    secret: "",
    callback: `${baseURL}/twitch/callback`,
    scope: ["user:read:email"],
  },
  linkedin: {
    enabled: false,
    icon: "linkedin",
    key: "",
    secret: "",
    callback: `${baseURL}/linkedin/callback`,
    scope: ["r_liteprofile", "r_emailaddress"],
  },
  cognito: {
    enabled: false,
    icon: "aws",
    key: "",
    secret: "",
    subdomain: "my.subdomain.com",
    callback: `${baseURL}/cognito/callback`,
    scope: ["email", "openid", "profile"],
  },
  reddit: {
    enabled: false,
    icon: "reddit",
    key: "",
    secret: "",
    state: true,
    callback: `${baseURL}/reddit/callback`,
    scope: ["identity"],
  },
  auth0: {
    enabled: false,
    icon: "",
    key: "",
    secret: "",
    subdomain: "my-tenant.eu",
    callback: `${baseURL}/auth0/callback`,
    scope: ["openid", "email", "profile"],
  },
  cas: {
    enabled: false,
    icon: "book",
    key: "",
    secret: "",
    callback: `${baseURL}/cas/callback`,
    scope: ["openid email"], // scopes should be space delimited
    subdomain: "my.subdomain.com/cas",
  },
  patreon: {
    enabled: false,
    icon: "",
    key: "",
    secret: "",
    callback: `${baseURL}/patreon/callback`,
    scope: ["identity", "identity[email]"],
  },
  keycloak: {
    enabled: false,
    icon: "",
    key: "",
    secret: "",
    subdomain: "my.subdomain.com/auth/callback",
    callback: `${baseURL}/keycloak/callback`,
    scope: ["email"],
  },
});

module.exports = grantConfig;
