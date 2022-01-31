import { gql } from "@apollo/client";
import SeoFragment from "../fragments/seo";
import SettingsFragment from '../fragments/settings';
import CategoriesFragment from '../fragments/categories';
export const PAGE_BY_URI = gql` 
  query PAGE_BY_URI($uri: String) {
    ${SettingsFragment}
    ${CategoriesFragment}
    page: pageBy(uri: $uri) {
        title
        id
        databaseId
        uri
        seo {
            ...SeoFragment
        }
        template {
            templateName
        }
        content
        blocks {
            innerBlocks {
                attributesJSON
            }
            name
            ... on AcfCategoriesBlock {
                categorie {
                    categorySlider {
                        children(first: 500000) {
                            nodes {
                                image {
                                    altText
                                    mediaDetails {
                                        width
                                        height
                                        sizes {
                                            width
                                            height
                                            sourceUrl
                                        }
                                    }
                                    sourceUrl
                                }
                                databaseId
                                slug
                                name
                            }
                        }
                        name
                    }
                }
            }
            ... on AcfHeroBlock {
                hero {
                    imagePosition
                    picture {
                        id
                        altText
                        sourceUrl
                        mediaDetails {
                            sizes {
                                height
                                name
                                sourceUrl
                                width
                            }
                            width
                            height
                        }
                    }
                    title
                    titleSize
                    buttonKind
                    button {
                        url
                        title
                    }
                }
            }
            ... on AcfShopbycolorBlock {
                slider {
                    title
                    instagram
                    shopByColor {
                        image {
                            altText
                            mediaDetails {
                                sizes {
                                    width
                                    height
                                    name
                                }
                                height
                                width
                            }
                            sourceUrl(size: MEDIUM_LARGE)
                        }
                        product {
                            ... on SimpleProduct {
                                id
                                name
                                onSale
                                salePrice
                                regularPrice
                                slug
                                productId: databaseId
                                price
                                featuredImage {
                                    node {
                                        sourceUrl(size: MEDIUM_LARGE)
                                        srcSet
                                        mediaDetails {
                                            width
                                            height
                                            sizes {
                                                width
                                                sourceUrl
                                                height
                                            }
                                        }
                                    }
                                }
                                details {
                                    capacity
                                }
                            }
                        }
                    }
                }
            }
            ... on AcfCoverBlock {
                cover {
                    title
                    imagePosition
                    subtitle
                    nomargin
                    picture {
                        altText
                        sourceUrl
                        mediaDetails {
                            height
                            sizes {
                                height
                                sourceUrl
                                width
                            }
                            width
                        }
                    }
                    button {
                        title
                        url
                    }
                }
            }
            ... on AcfScrollerBlock {
                scroller {
                    text
                }
            }
            ... on AcfProductsBlock {
                attributes {
                    data
                }
                bloccoProdotti {
                    content
                    title
                    timer
                    kind
                }
            }
            ... on AcfQuizBlock {
                quiz {
                    content
                    introTitle
                    slides {
                        question
                        cat {
                            databaseId
                            children(first: 5000) {
                                nodes {
                                    databaseId
                                    parentDatabaseId
                                    name
                                    categoryDetails {
                                        thumb {
                                            sourceUrl
                                            mediaDetails {
                                                width
                                                sizes {
                                                    sourceUrl
                                                    width
                                                    height
                                                }
                                                height
                                            }
                                            altText
                                        }
                                    }
                                }
                            }
                        }
                    }
                    title
                }
            }
            ... on AcfNewsBlock {
                bloccoNews {
                    news {
                        title
                        content
                        category
                        button {
                            url
                            title
                        }
                        picture {
                            title
                            sourceUrl
                            altText
                            mediaDetails {
                                width
                                height
                                sizes {
                                    height
                                    sourceUrl
                                    width
                                }
                            }
                        }
                    }
                }
            }
            ... on AcfNewsletterBlock {
                newsletter {
                    content
                    picture {
                        sourceUrl
                        altText
                        mediaDetails {
                            width
                            height
                        }
                    }
                }
            }
        }
    }
}
${SeoFragment}
`