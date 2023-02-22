module.exports = {
  routes: [
    {
      method: 'POST',
      // prefix:'/session',
      path: '/sessions/check_and_create',
      handler: 'session.checkAndCreate',
    },
  ],
};
