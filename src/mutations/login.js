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
            roles {
                nodes {
                    displayName
                    name
                }
            }
        }
        customer {
            ${UserFragment}
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