export default function PageNo(props) {
    const { products, categories, queryParams, pageInfo, params } = props;
    
    return (
        <Layout {...props}>
            <Seo seo={props.seo} uri={props.uri} />
            <ProductArchive {...{products, categories, params: queryParams, pageInfo}}  />
        </Layout>
    )
};



export async function getStaticProps( context ) {
    const {params: { pageNo }} = context;
    const menus = await client.query({
        query: GET_MENUS,
    });
    const offset = getPageOffset( pageNo );
    const variables = {
        uri: '/prodotti',
        offset, 
    };

    const { data, errors } = await client.query( {
        query: GET_PRODUCT_ARCHIVE,
        variables,
    } );

    const queryParams = [];

    data?.categories?.nodes && data?.categories?.nodes.map((category) => {
        if (!isEmpty(category?.slug)) {
            queryParams.push( category?.slug );
        }
    });
    return {
        props: {
            seo : data?.page?.seo ?? '',
            uri : data?.page?.uri,
            products : data?.products?.edges ?? [],
            categories: data?.categories?.nodes ?? [],
            queryParams: queryParams,
            pageInfo: data?.products?.pageInfo,
            menus: menus
        },
        revalidate: 1
    }
}

export async function getStaticPaths() {
    const { data } = await client.query( {
        query: GET_TOTAL_PRODUCTS_COUNT,
    } );
    const totalProductsCount = data?.productsCount?.pageInfo?.offsetPagination?.total ?? 0;
    //* since the first page posts and other page posts will be different, we subtract the no of posts we'll show on first page and then divide the result with the no of posts we'll show on other pages and then will add 1 for the first page that we subtracted.
    const pagesCount =  Math.ceil( ( totalProductsCount - PER_PAGE_FIRST ) / PER_PAGE_REST + 1 );
    const paths = new Array( pagesCount ).fill( '' ).map( ( _, index ) => ( {
        params: {
            pageNo: ( index + 1 ).toString(),
        },
    } ) );

    return {
        paths: [ ...paths ],
        fallback: false,
    };
}