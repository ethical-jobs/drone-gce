const Base64 = require('js-base64').Base64;
const serviceKey = require('./_fixtures/service-key');
const plugin = require('../plugin');

it('can decode an encoded service key', () => {
  const encodedServiceKey = Base64.encode(JSON.stringify(serviceKey));
  expect(plugin.decodeServiceKey(encodedServiceKey)).toEqual(serviceKey);
});
