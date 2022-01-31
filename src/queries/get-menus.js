import { gql } from "@apollo/client";
import CategoriesFragment from './fragments/categories';

/**
 * GraphQL countries query.
 */
export const GET_MENUS = gql`
query GET_MENUS {
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
}
`;