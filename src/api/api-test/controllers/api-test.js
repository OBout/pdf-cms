const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  async generatePDF(ctx) {
    try {
      const { testData } = ctx.request.body;
      const ipAddress = ctx.request.ip;

      if (!ipAddress || !testData) {
        return ctx.badRequest('ipAddress en test data zijn verplicht.');
      }

      const response = await axios.post('http://localhost:8443', { testData });

      ctx.send(response.data);
    } catch (error) {
      strapi.log.error(error);
      ctx.internalServerError('PDF-generatie mislukt');
    }
  },
};
