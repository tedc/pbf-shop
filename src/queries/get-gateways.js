import { gql } from '@apollo/client';

export const GET_GATEWAYS = gql`
  query GET_GATEWAYS {
    paymentGateways(first: 5000) {
        nodes {
            description
            icon
            id
            title
            instructions
            enabled
            order
            accountDetails {
                bic
                iban
                name
                number
                sort
            }
        }
    }
  }
`;