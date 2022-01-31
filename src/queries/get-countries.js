import { gql } from "@apollo/client";

/**
 * GraphQL countries query.
 */
const GET_COUNTRIES = gql`query GET_COUNTRIES{
  wooCountries {
    billingCountries {
      value: countryCode
      label: countryName
    }
    shippingCountries {
      value: countryCode
      label: countryName
    }
  }
}`;

export default GET_COUNTRIES;
