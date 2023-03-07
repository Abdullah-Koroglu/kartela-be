'use strict';

/**
 * session-type service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::session-type.session-type');
