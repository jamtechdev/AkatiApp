export const API_URL = 'https://dev.akatibird.com/api/customer';
export const IMAGE_API_URL =
  'https://dev.akatibird.com/storage/book-front-cover/';
export const PAYPAL_CLIENT_ID =
  'AdUP4boW0BB7uxglGu0hNwP8RFVsZ2W7b3nN0Dgj9kMrWtRI_FbRHVKKf7ciuiD-0hpMVEHYnj0R63Hf';
export const CINETPAY_API_ID = '695644265ece900561f2c6.42532258';
// '25656480763908bd3ae0221.11237117';
export const CINETPAY_SITE_ID = '5876262';
export const RETURN_URL = 'https://dev.akatibird.com/payment/';
export const PAYMENT_URL = 'https://api.paypal.com/'; //LIVE PAYMENT URL
// export const PAYMENT_URL = 'https://api.sandbox.paypal.com/'; //DEVELOPMENT PAYMENT URL
export const auth = {
  Username:
    'Afpdigg4ddVECCQifzGXScb9n5mhkOkdEvh-RSL8fTh4g0xpUsRdXmHT7A64wcmten_YIsRI38h6jR0s', //"your_paypal-app-client-ID", ----->LIVE
  // 'AdUP4boW0BB7uxglGu0hNwP8RFVsZ2W7b3nN0Dgj9kMrWtRI_FbRHVKKf7ciuiD-0hpMVEHYnj0R63Hf', //"your_paypal-app-client-ID",---- DEV
  Password:
    'EIGVqyjApFhFKNU7vY2fVFlVXoRKFwTHhu2OGsw8R7je-pRimHIAaUcFpx8pFaQ_o-IbkxhJtdE1ajJp', //"your-paypal-app-secret-ID   ------>LIVE
  // 'EBc99xva3dsQwXYPW6P7mlnqiqINKw_vU5pTv1u0adlttr0ryY_AEh2EJEMI3KohZD_j2yfm9fRGxWm6', //"your-paypal-app-secret-ID  ---DEV
};

const Config = {
  API_URL,
  IMAGE_API_URL,
  PAYPAL_CLIENT_ID,
  CINETPAY_API_ID,
  CINETPAY_SITE_ID,
  RETURN_URL,
};
export default Config;
