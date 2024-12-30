'use strict';

/**
 * api-tester service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::api-tester.api-tester');
