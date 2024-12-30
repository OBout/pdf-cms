'use strict';

/**
 * api-tester controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::api-tester.api-tester');
