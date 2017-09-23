'use strict';

const WIT_TOKEN = process.env.WIT_TOKEN || 'J7H7ZZU5IRVAL2XOAUPCV44YXDLBBRAX';
if (!WIT_TOKEN) {
  throw new Error('Missing WIT_TOKEN. Go to https://wit.ai/docs/quickstart to get one.')
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'EAACmaZCyZCcqgBAI6ObSKlRycWY86zlYrPUvEvMhNZCwZByTfs4XX5vj6pGzHz6aU2ZCPZAvRgtnSVmyV7fjkYRyx6AUrs6tWZBsZClXZAPBdZCLr6hqjShNUh9vqr9yAqaMPQZCuoDQQv4ZBI5Xh4JjhqFMK36HZBJhFMkUw9NzOkNSatQZDZD';
if (!FB_PAGE_TOKEN) {
	throw new Error('Missing FB_PAGE_TOKEN. Go to https://developers.facebook.com/docs/pages/access-tokens to get one.')
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'just_do_it'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}