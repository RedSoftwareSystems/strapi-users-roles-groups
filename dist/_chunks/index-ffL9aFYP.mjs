import { prefixPluginTranslations } from "@strapi/helper-plugin";
const __variableDynamicImportRuntimeHelper = (glob, path) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
  });
};
const name = "users-permissions-ext";
const version = "0.0.1";
const description = "Protect your API with a full-authentication process based on JWT";
const repository = {
  type: "git",
  url: "git@github.com:RedSoftwareSystems/strapi-users-roles-groups.git"
};
const license = "SEE LICENSE IN LICENSE";
const author = {
  name: "RED Software Systems s.r.l.",
  email: "hi@red.software.systems",
  url: "https://red.software.systems"
};
const maintainers = [
  {
    name: "RED Software Systems s.r.l.",
    email: "hi@red.software.systems",
    url: "https://red.software.systems"
  }
];
const exports = {
  "./strapi-admin": {
    source: "./admin/src/index.js",
    "import": "./dist/admin/index.mjs",
    require: "./dist/admin/index.js",
    "default": "./dist/admin/index.js"
  },
  "./strapi-server": {
    source: "./strapi-server.js",
    require: "./strapi-server.js",
    "default": "./strapi-server.js"
  },
  "./package.json": "./package.json"
};
const scripts = {
  build: "pack-up build",
  check: "pack-up check",
  clean: "run-p clean:dist clean:docs",
  "clean:dist": "rimraf dist",
  "clean:docs": "run-p clean:docs:server",
  "clean:docs:server": "rimraf docs/server",
  doc: "run-p jsdoc:server",
  "jsdoc:server": "jsdoc server -r -c jsdoc.conf.json -d docs/server",
  "test:server": "jest ./server",
  "test:unit:watch": "run -T jest --watch",
  watch: "pack-up watch"
};
const dependencies = {
  "@strapi/design-system": "1.14.1",
  "@strapi/helper-plugin": "4.19.0",
  "@strapi/icons": "1.14.1",
  "@strapi/utils": "4.19.0",
  bcryptjs: "2.4.3",
  "core-js": "^3.35.1",
  formik: "2.4.0",
  "grant-koa": "5.4.8",
  immer: "9.0.19",
  jsonwebtoken: "9.0.0",
  "jwk-to-pem": "2.0.5",
  koa: "2.13.4",
  "koa2-ratelimit": "^1.1.2",
  lodash: "4.17.21",
  "prop-types": "^15.8.1",
  purest: "4.0.2",
  "react-intl": "6.4.1",
  "react-query": "3.39.3",
  "react-redux": "8.1.1",
  "url-join": "4.0.1",
  yup: "0.32.9"
};
const devDependencies = {
  "@strapi/pack-up": "4.19.0",
  "@strapi/strapi": "4.19.0",
  "@testing-library/dom": "9.2.0",
  "@testing-library/react": "14.0.0",
  "@testing-library/user-event": "14.4.3",
  jest: "^29.7.0",
  "jest-watch-typeahead": "^2.2.2",
  jsdoc: "^4.0.2",
  "jsdoc-plugin-intersection": "^1.0.4",
  "jsdoc-to-markdown": "^8.0.0",
  "jsdoc-tsimport-plugin": "^1.0.5",
  msw: "1.3.0",
  react: "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "5.3.4",
  rimraf: "^5.0.5",
  "styled-components": "5.3.3"
};
const peerDependencies = {
  "@strapi/strapi": "^4.0.0",
  react: "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0",
  "react-router-dom": "^5.2.0",
  "styled-components": "^5.2.1"
};
const engines = {
  node: ">=18.0.0 <=20.x.x",
  npm: ">=6.0.0"
};
const strapi = {
  displayName: "Roles & Permissions",
  name: "plugin-users-permissions-ext",
  description: "Protect your API with a full authentication process based on JWT. This plugin comes also with an ACL strategy that allows you to manage the permissions between the groups of users.",
  required: true,
  kind: "plugin"
};
const pluginPkg = {
  name,
  version,
  description,
  repository,
  license,
  author,
  maintainers,
  exports,
  scripts,
  dependencies,
  devDependencies,
  peerDependencies,
  engines,
  strapi
};
const pluginId = pluginPkg.name.replace(/^@strapi\/plugin-/i, "");
const PERMISSIONS = {
  // Roles
  accessRoles: [
    { action: `plugin::${pluginId}.roles.create`, subject: null },
    { action: `plugin::${pluginId}.roles.read`, subject: null }
  ],
  createRole: [{ action: `plugin::${pluginId}.roles.create`, subject: null }],
  deleteRole: [{ action: `plugin::${pluginId}.roles.delete`, subject: null }],
  readRoles: [{ action: `plugin::${pluginId}.roles.read`, subject: null }],
  updateRole: [{ action: `plugin::${pluginId}.roles.update`, subject: null }],
  // AdvancedSettings
  readAdvancedSettings: [
    { action: `plugin::${pluginId}.advanced-settings.read`, subject: null }
  ],
  updateAdvancedSettings: [
    { action: `plugin::${pluginId}.advanced-settings.update`, subject: null }
  ],
  // Emails
  readEmailTemplates: [
    { action: `plugin::${pluginId}.email-templates.read`, subject: null }
  ],
  updateEmailTemplates: [
    { action: `plugin::${pluginId}.email-templates.update`, subject: null }
  ],
  // Providers
  readProviders: [
    { action: `plugin::${pluginId}.providers.read`, subject: null }
  ],
  updateProviders: [
    { action: `plugin::${pluginId}.providers.update`, subject: null }
  ]
};
const getTrad = (id) => `${pluginId}.${id}`;
const index = {
  register(app) {
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: getTrad("Settings.section-label"),
          defaultMessage: "Users & Permissions plugin"
        }
      },
      [
        {
          intlLabel: {
            id: "global.roles",
            defaultMessage: "Roles"
          },
          id: "roles",
          to: `/settings/${pluginId}/roles`,
          async Component() {
            const component = await import("./index-QPZmIKN4.mjs");
            return component;
          },
          permissions: PERMISSIONS.accessRoles
        },
        {
          intlLabel: {
            id: getTrad("HeaderNav.link.providers"),
            defaultMessage: "Providers"
          },
          id: "providers",
          to: `/settings/${pluginId}/providers`,
          async Component() {
            const component = await import("./index-a_NvOsPW.mjs");
            return component;
          },
          permissions: PERMISSIONS.readProviders
        },
        {
          intlLabel: {
            id: getTrad("HeaderNav.link.emailTemplates"),
            defaultMessage: "Email templates"
          },
          id: "email-templates",
          to: `/settings/${pluginId}/email-templates`,
          async Component() {
            const component = await import("./index-FGNtdb0P.mjs");
            return component;
          },
          permissions: PERMISSIONS.readEmailTemplates
        },
        {
          intlLabel: {
            id: getTrad("HeaderNav.link.advancedSettings"),
            defaultMessage: "Advanced Settings"
          },
          id: "advanced-settings",
          to: `/settings/${pluginId}/advanced-settings`,
          async Component() {
            const component = await import("./index-teH-15b7.mjs");
            return component;
          },
          permissions: PERMISSIONS.readAdvancedSettings
        }
      ]
    );
    app.registerPlugin({
      id: pluginId,
      name: pluginId
    });
  },
  bootstrap() {
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/ar.json": () => import("./ar-MvD8Ghac.mjs"), "./translations/cs.json": () => import("./cs-BMuXwxA1.mjs"), "./translations/de.json": () => import("./de-zs2qqc0W.mjs"), "./translations/dk.json": () => import("./dk-HctVBMsG.mjs"), "./translations/en.json": () => import("./en-l9M7pftz.mjs"), "./translations/es.json": () => import("./es-9381tih_.mjs"), "./translations/fr.json": () => import("./fr-CMSc77If.mjs"), "./translations/id.json": () => import("./id-SDuyIkZa.mjs"), "./translations/it.json": () => import("./it-bvH7DgQo.mjs"), "./translations/ja.json": () => import("./ja-o_-JPvQv.mjs"), "./translations/ko.json": () => import("./ko-XJbPSez_.mjs"), "./translations/ms.json": () => import("./ms-II5Ea73J.mjs"), "./translations/nl.json": () => import("./nl-vEy6TN0K.mjs"), "./translations/pl.json": () => import("./pl-2VowaFGt.mjs"), "./translations/pt-BR.json": () => import("./pt-BR-sS1Xp3Jt.mjs"), "./translations/pt.json": () => import("./pt-Rf9W51IO.mjs"), "./translations/ru.json": () => import("./ru-qKHnd5or.mjs"), "./translations/sk.json": () => import("./sk-_Ryr-eTT.mjs"), "./translations/sv.json": () => import("./sv-BqzScFXS.mjs"), "./translations/th.json": () => import("./th-WsknMEpq.mjs"), "./translations/tr.json": () => import("./tr-_DB1F1GW.mjs"), "./translations/uk.json": () => import("./uk-yxMSQAwI.mjs"), "./translations/vi.json": () => import("./vi-xY0zCW3d.mjs"), "./translations/zh-Hans.json": () => import("./zh-Hans-E84cu4kP.mjs"), "./translations/zh.json": () => import("./zh-OFeldzbX.mjs") }), `./translations/${locale}.json`).then(({ default: data }) => {
          return {
            data: prefixPluginTranslations(data, pluginId),
            locale
          };
        }).catch(() => {
          return {
            data: {},
            locale
          };
        });
      })
    );
    return Promise.resolve(importedTrads);
  }
};
export {
  PERMISSIONS as P,
  getTrad as g,
  index as i,
  pluginId as p
};
//# sourceMappingURL=index-ffL9aFYP.mjs.map
