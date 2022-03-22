import { gql } from "@apollo/client";
import UserFragment from '../queries/fragments/user';

export const LOGIN = gql`
mutation LOGIN ( $input: LoginInput!) {
    login(
        input: $input
    ) {
        authToken
        refreshToken
        user {
            id
            username
            name
            email
            firstName
            lastName
            databaseId
            jwtAuthExpiration
            jwtUserSecret
            jwtRefreshToken
            jwtAuthToken
            nicename
            connection {
                wholesalerParent {
                    databaseId
                }
            }
            roles {
                nodes {
                    displayName
                    name
                }
            }
        }
        customer {
            wholesalerParentName
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
            shipping {
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
                state
            }
        }
    }
}
`;


export const REFRESH = gql`
mutation REFRESH($input: RefreshJwtAuthTokenInput!) {
  refreshJwtAuthToken(
    input: $input) {
    authToken
  }
}
`;