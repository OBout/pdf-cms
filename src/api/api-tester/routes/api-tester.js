'use strict';

/**
 * api-tester router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::api-tester.api-tester');
