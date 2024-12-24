const country = ["Benin", "Congo","Congo, Democratic Republic of the","Ghana", "Lesotho", "Nigeria", "Sierra Leone", "Zambia", "Burkina Faso",  "Côte d'Ivoire", "Malawi", "Rwanda", "Tanzania, United Republic of", "Cameroon", "Gabon", "Kenya", "Mozambique", "Senegal", "Uganda"];

const getPaymentMethod = (selectedCountry) => {
  console.log(selectedCountry,"selected...")
  if (selectedCountry == 'Togo' || selectedCountry == "Côte d'Ivoire") {
    return ['paypal', 'cinetpay']
  } else if (country.includes(selectedCountry)) {
    return ['pawapay', 'paypal']
  } else {
    return ['paypal']

  }
}

export const supportedCountries = [
  { country: "Zambia", isoCode: "ZMB", phoneCode: "260" },
  { country: "Ghana", isoCode: "GHA", phoneCode: "233" },
  { country: "Kenya", isoCode: "KEN", phoneCode: "254" },
  { country: "Nigeria", isoCode: "NGA", phoneCode: "234" },
  { country: "Tanzania, United Republic of", isoCode: "TZA", phoneCode: "255" },
  { country: "Uganda", isoCode: "UGA", phoneCode: "256" },
  { country: "Rwanda", isoCode: "RWA", phoneCode: "250" },
  // { country: "Ivory Coast (Côte d'Ivoire)", isoCode: "CIV", phoneCode: "225" },
  { country: "Cameroon", isoCode: "CMR", phoneCode: "237" },
  { country: "Senegal", isoCode: "SEN", phoneCode: "221" },
  { country: "Mozambique", isoCode: "MOZ", phoneCode: "258" },
  { country: "Benin", isoCode: "BEN", phoneCode: "229" },
  { country: "Congo", isoCode: "COG", phoneCode: "242" },
  { country: "Congo, Democratic Republic of the", isoCode: "COD", phoneCode: "243" },
  { country: "Lesotho", isoCode: "LSO", phoneCode: "266" },
  { country: "Sierra Leone", isoCode: "SLE", phoneCode: "232" },
  { country: "Burkina Faso", isoCode: "BFA", phoneCode: "226" },
  { country: "Gabon", isoCode: "GAB", phoneCode: "241" }
];



export default getPaymentMethod;