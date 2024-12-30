module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/stripe/webhook',
      handler: 'stripe.webhook',
      config: {
        auth: false, // Disable authentication for the webhook
        middlewares: [],
        policies: [],
      },
    },
  ],
};
