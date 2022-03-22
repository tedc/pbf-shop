import { gql } from "@apollo/client";

/**
 * GraphQL countries query.
 */
export const GET_MENUS = gql`
query GET_MENUS {
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
}`;

export const LAST_BANNER = gql`
query LAST_BANNER {
  banners(first: 1) {
    nodes {
      bannerId
      content
      options {
        background
      }
    }
  }
}`;