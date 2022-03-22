const CategoriesFragment = `
categories: productCategories(where: {orderby: NAME, order: ASC, parent: 0, hideEmpty: true}, first: 5000) {
    nodes {
        databaseId
        id
        name
        slug
        parentDatabaseId
        ancestors {
            nodes {
                slug
                ancestors {
                    nodes {
                        slug
                    }
                }
            }
        }
        categoryDetails {
            thumb {
                mediaDetails {
                    height
                    width
                }
                sourceUrl
                altText
            }
            color
        }
        image {
            mediaDetails {
                height
                width
            }
            sourceUrl
            altText
        }
        children {
            nodes {
                slug
                name
                databaseId
                parentDatabaseId
                id
            }
        }
    }
}`;

export default CategoriesFragment;