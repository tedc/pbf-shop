import { gql } from "@apollo/client";
import SeoFragment from "../fragments/seo";
import SettingsFragment from "../fragments/settings";
import CategoriesFragment from '../fragments/categories';
import {ProductFragment} from '../fragments/product';

export const PRODUCT_BY_SLUG_QUERY = gql` query Product($slug: ID!) {
    ${SettingsFragment}
    ${CategoriesFragment}
    product(id: $slug, idType: SLUG) {
        id
        productId: databaseId
        averageRating
        slug
        name
        shortDescription
        metaData {
            key
            value
        }
        userVisibility {
            id
            role
        }
        seo {
            ...SeoFragment
        }
        relatedKit(first: 6) {
            edges {
                node {
                    ${ProductFragment}
                }
            }
        }
        related(first: 6) {
            edges {
                node {
                    ${ProductFragment}
                }
            }
        }
        details {
            capacity
            hideOnB2c
            wholesalerProduct
            firstTab {
                content
                title
            }
            secondTab {
                content
                title
            }
            thirdTab {
                content
                title
            }
            benefits {
                content
                icons {
                    text
                    icon {
                        altText
                        sourceUrl
                        mediaDetails {
                            height
                            width
                        }
                    }
                }
                image {
                    altText
                    sourceUrl
                    mediaDetails {
                        height
                        width
                        sizes {
                            sourceUrl
                            width
                            height
                        }
                    }
                }
                title
            }
            ingredients {
                image {
                    altText
                    sourceUrl
                    mediaDetails {
                        height
                        width
                    }
                }
                title
                rows {
                    value
                    name
                }
            }
            extraRows {
                content
                subtitle
                title
                image {
                    altText
                    sourceUrl
                    mediaDetails {
                        height
                        width
                        sizes {
                            height
                            sourceUrl
                            width
                        }
                    }
                }
            }
        }
        productCategories(first: 5000, where: {order: ASC, orderby: TERM_ORDER} ) {
            nodes {
                parentDatabaseId
                databaseId
                name
                slug
                link
                ancestors {
                    nodes {
                        slug
                        ancestors {
                            nodes {
                                id
                            }
                        }
                    }
                }
            }
        }
        kits {
            nodes {
                databaseId
            }
        }
        galleryImages {
            nodes {
                id
                title
                altText
                mediaItemUrl
            }
        }
        image {
            id
            altText
            sourceUrl
            mediaDetails {
                height
                width
            }
        }
        ... on SimpleProduct {
            price
            id
            regularPrice
            stockQuantity
            sku
        }
        ... on VariableProduct {
            price
            id
            regularPrice
            stockQuantity
            sku
        }
        ... on ExternalProduct {
            price
            id
            regularPrice
            externalUrl
            sku
        }
        ... on GroupProduct {
            products {
                nodes {
                    ... on SimpleProduct {
                        id
                        price
                        regularPrice
                        stockQuantity
                        sku
                    }
                }
            }
            id
        }
    }
}
${SeoFragment}
`;

export const PRODUCT_SLUGS = gql` query Products {
    products(first: 5000) {
        nodes {
            id
            slug
        }
    }
}
`;
