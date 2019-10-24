const fs = require('fs');
const path = require('path');
const qs = require('qs');
const Handlebars = require('handlebars');

const orderTemplate = fs.readFileSync(path.resolve('backend/templates/order-page.hbs'), 'utf-8');
const template = Handlebars.compile(orderTemplate);

module.exports = function orderPage(ctx) {
  const [, queryString] = ctx.request.url.split('?');
  const query = qs.parse(queryString);
  return template({
    orderParams: JSON.stringify({
      project: '5cd5620f06ae110001509185',
      amount: 20,
      currency: 'USD',
      type: 'simple',
    }),
    formOptions: JSON.stringify((query.loading ? { layout: 'loading' } : {})),
  });
};
