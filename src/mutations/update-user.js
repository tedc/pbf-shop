import { gql } from '@apollo/client';

import UserFragment from '../queries/fragments/user';

export const UPDATE_USER = gql`
mutation UpdateUser($input:UpdateCustomerInput!) {
  updateCustomer(
    input: $input
  ) {
    authToken
    clientMutationId
    refreshToken
    customer {
        ${UserFragment}
    }
  }
}
`;

export const REGISTER_USER = gql`
mutation RegisterUser($input:CreateCustomerInput!) {
    createCustomer(
        input: $input
    ) {
        customer {
            databaseId
            billing {
                address1
                address2
                city
                company
                country
                email
                lastName
                firstName
                phone
                postcode
                vat
                state
            }
        }
    }
}`;