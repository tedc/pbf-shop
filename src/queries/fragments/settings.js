const SettingsFragment = `
    header: getHeader {
        favicon
        siteLogoUrl
        siteTagLine
        siteTitle
    }
    menus {
        edges {
            node {
                locations
                menuItems {
                    nodes {
                        id
                        databaseId
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
`;

export default SettingsFragment;