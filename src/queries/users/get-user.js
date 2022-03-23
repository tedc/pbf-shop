import { gql } from '@apollo/client'; 
import UserFragment from '../fragments/user';
import {ProductFragment} from '../fragments/product';
import OrderFragment from '../fragments/order';
import CategoriesFragment from '../fragments/categories';

export const GET_CUSTOMER = gql`
query GET_CUSTOMER($id:Int!) {
    customer(customerId: $id) {
        email
        firstName
        lastName
        ${UserFragment}
        wholesalerParentName
    }
}
`;

export const GET_CUSTOMER_GROUP = gql`
query GET_CUSTOMER_GROUP($parent:Int) {
    ${CategoriesFragment}
    menus {
        edges {
            node {
                locations
                menuItems {
                    nodes {
                        title
                        path
                        label
                        cssClasses
                        target
                        url
                    }
                }
            }
        }
    }
    optionsPage {
        impostazioni {
            bodyScripts
            fieldGroupName
            footerCopyright
            footerScripts
            footerSocial {
                footerSocialLink
                footerSocialService
            }
            headScripts
            siteEmail
            sitePhone
            siteWhatsapp
            loginTitle
            loginContent
            loginCover {
                sourceUrl
            }
            privacyPage {
                ... on Page {
                    slug
                    title
                }
            }
            cookiePage {
                ... on Page {
                    slug
                    title
                }
            }
        }
    }
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
    customers(where: {parent:$parent}) {
        nodes {
            email
            firstName
            lastName
            ${UserFragment}
        }
    }
    customer(customerId: $parent) {
        email
        firstName
        lastName
        ${UserFragment}
    }
}
`;

export const GET_ORDERS = gql`
query GET_ORDERS($customerId:Int!) {
    customer(customerId: $customerId) {
        orders(first: 9999, where: { statuses : [PENDING, FAILED, PROCESSING, ON_HOLD, COMPLETED, REFUNDED]}) {
            nodes {
                ${OrderFragment}
            }
        }
    }
}
`

export const GET_ORDER = gql`
query GET_ORDER($id:ID!) {
    order(id: $id, idType: DATABASE_ID) {
        ${OrderFragment}
    }
}
`;

export const GET_HAIRDRESSER_PAYMENTS_INFO = gql`
query GET_HAIRDRESSER_PAYMENTS_INFO($id:ID!) {
    user(id: $id, idType: DATABASE_ID) {
        payments {
            bacs
            cod
        }
    }
}
`;