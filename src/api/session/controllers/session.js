'use strict';

/**
 * session controller
 */

// const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::session.session');
const { ValidationError } = require("@strapi/utils").errors;

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::session.session', ({ strapi }) => ({
  // Method 1: Creating an entirely custom action
  async checkAndCreate(ctx) {
    try {
      // some logic here
      const {start_time, end_time, room} = ctx.request.body.data
      // console.log (room)
      const occupation = await strapi.db.query('api::session.session').count({
        where: {
          $and: [
            {
              $or: [
                {
                  $and: [
                    {
                      end_time: {$gte: start_time}
                    },
                    {
                      end_time: {$lte: end_time}
                    },
                  ]
                },
                {
                  $and: [
                    {
                      start_time: {$gte: start_time}
                    },
                    {
                      start_time: {$lte: end_time}
                    },
                  ]
                },
                {
                  $and: [
                    {
                      end_time: {$gte: end_time}
                    },
                    {
                      start_time: {$lte: start_time}
                    },
                  ]
                },
              ]
            },
            {
              room: room
            }
          ]
        }
      });
      if (start_time > end_time){
        ctx.body = 'error'
        return ctx.badRequest('Baslangic vakti bitisten kucuk olmak zorunda')

      }
      if (occupation > 0){
        ctx.body = 'error'
        return ctx.badRequest('Bu vakitlerde bu oda musait degil.')
      }


      const response = await super.create(ctx);

      return response;
    } catch (err) {
      ctx.body = err;
    }
  },

  // // Method 2: Wrapping a core action (leaves core logic in place)
  // async find(ctx) {
  //   // some custom logic here
  //   ctx.query = { ...ctx.query, local: 'en' };

  //   // Calling the default core action
  //   const { data, meta } = await super.find(ctx);

  //   // some more custom logic
  //   meta.date = Date.now();

  //   return { data, meta };
  // },

  // // Method 3: Replacing a core action
  // async findOne(ctx) {
  //   const { id } = ctx.params;
  //   const { query } = ctx;

  //   const entity = await strapi.service('api::restaurant.restaurant').findOne(id, query);
  //   const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

  //   return this.transformResponse(sanitizedEntity);
  // },
}));
