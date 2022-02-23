import Layout from '../../src/components/Layout';
import { useRouter } from 'next/router';
import client from '../../src/components/ApolloClient';
import AddToCartButton from '../../src/components/cart/AddToCartButton';
import {PRODUCT_BY_SLUG_QUERY, PRODUCT_SLUGS} from '../../src/queries/products/get-product';
import {GET_PRODUCTS} from '../../src/queries/products/get-products';
import { isEmpty, isNull, isUndefined } from 'lodash';
import GalleryCarousel from "../../src/components/single-product/gallery-carousel";
import Price from "../../src/components/single-product/price";
import Title from "../../src/components/commons/Title";
import Related from "../../src/components/product/Related";
import Breadcrumbs from "../../src/components/product/Breadcrumbs";
import Tabs from "../../src/components/product/Tabs";
import Blocks from "../../src/components/product/Blocks";
import Image from "../../src/image";
import Seo from '../../src/components/seo';
import { useSession } from 'next-auth/react';
import { useLazyQuery } from '@apollo/client';
import { useState } from 'react';

export default function Product(props) {
    const { product, slug } = props;
    const router = useRouter();
    const { data : session, status } = useSession();

    const [item, setItem ] = useState( product );

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    if( session?.user ) {
        let role;
        session?.user?.roles?.nodes.map((r) => {
            role = r?.name !== 'customer' ? r?.name : null;
        })
        if( !isEmpty( product?.metaData ) && role !== 'custoemr' ) {
            let visible = true;
            product?.metaData.map((item)=> {
                if( item?.key === '_cus_base_price' || item?.key === '_role_base_price') {
                    if (!isEmpty( item?.value ) ) {
                        visible = false;
                    }
                }
            });
            if(!visible) {
                router.push('/');
            }
        }
    }

    const title = {
        content: product.name,
        size: 'title--font-size-38 title--grow-30',
    }
    const productCategories = product?.productCategories?.nodes;
    const kits = [];
    const categories = [];
    const breadcrumbs = [{
        link: '/prodotti/',
        name: 'Prodotti',
    }];
    let mainCategory;


    if( !isEmpty( product.kits.nodes) && !isNull( product.kits.nodes ) && !isUndefined(product.kits.nodes) ) {
        product.kits.nodes.map((kit) => {
            kits.push(kit.databaseId)
        })
    }


    if( !isEmpty( productCategories ) ) {
        productCategories.map((cat) => {
            if( isNull( cat.parentDatabaseId ) ) {
                mainCategory = {
                    link : cat.slug,
                    name : cat.name
                };
            }
            let base = isNull( cat.parentDatabaseId ) ? cat?.slug : '';
            if( ! isNull( cat.parentDatabaseId ) ) {
                cat?.ancestors?.nodes.map((a)=> {
                    if( isNull( a?.ancestors?.nodes ) ) {
                        base = a?.slug;
                    }
                })
            }
            const link = isNull( cat.parentDatabaseId ) ? 'all' : cat?.slug;
            categories.push(cat.databaseId);
            breadcrumbs.push({
                base: base,
                link : link,
                name: cat.name
            })
        })
    }

    const [ kitProps, setKitProps ] = useState( {
        title: 'Kit di lavorazione',
        products: product?.relatedKit?.edges ?? [],
        content: '<p>Gli utenti che hanno acquistato questo prodotto hanno anche guardato questi prodotti</p>',
    });
    const [ relatedProps, setRelatedProps  ] = useState( {
        title: 'Ti potrebbero interessare',
        products: product?.related?.edges ?? [],
        content: '<p>Gli utenti che hanno acquistato questo prodotto hanno anche guardato questi prodotti</p>',
    } );

    const [ fetchPosts, { loading } ] = useLazyQuery( PRODUCT_BY_SLUG_QUERY, {
        notifyOnNetworkStatusChange: true,
        onCompleted: ( data ) => {
            setItem( data?.product ?? {} );
            setKitProps( {
                title: 'Kit di lavorazione',
                products: data?.product?.relatedKit?.edges ?? [],
                content: '<p>Gli utenti che hanno acquistato questo prodotto hanno anche guardato questi prodotti</p>',
            })
            setRelatedProps({
                title: 'Ti potrebbero interessare',
                products: data?.product?.related?.edges ?? [],
                content: '<p>Gli utenti che hanno acquistato questo prodotto hanno anche guardato questi prodotti</p>',
            } )
        },
        onError: ( error ) => {
            console.log(error)
            //setSearchError( error?.graphQLErrors ?? '' );
        }
    } );
    
    return (
        <Layout {...props}>
            <Seo seo={props.seo} uri={props.product.slug} />
            { product ? (
                <div className="product product--single">
                    <Breadcrumbs breadcrumbs={breadcrumbs} name={product?.name}/>
                    <div className="columns columns--block columns--block-product">
                        <div className="column--s6-md column--figure">

                            { !isEmpty( product?.galleryImages?.nodes ) ? (
                                <GalleryCarousel gallery={product?.galleryImages?.nodes}/>
                            ) : !isEmpty( product.image ) ? (
                               <Image
                                    width={product?.image?.mediaDetails?.width}
                                    height={product?.image?.mediaDetails?.height}
                                    loading="lazy"
                                    sourceUrl={ product?.image?.sourceUrl ?? '' }
                                    srcSet={ product?.image?.srcSet }
                                    altText={product?.image?.altText ?? product.name}
                                />
                            ) : null }
                        </div>
                        <div className="column column--s6-md column--content">
                            <div className="product__content">
                                <Price salesPrice={product?.price} regularPrice={product?.regularPrice} discount={true} />
                                <Title title={title}/>
                                <div

                                    dangerouslySetInnerHTML={ {
                                        __html: product.description,
                                    } }
                                    className="product__description product__description--grow-30-bottom"
                                />
                                <>
                                { !isUndefined(product.details.capacity) ? (
                                    <span className="product__capacity">
                                    {product.details.capacity}
                                    </span>
                                ) : ''}
                                </>
                                <Tabs {...{tabs : {firstTab: product.details.firstTab, secondTab: product.details.secondTab, thirdTab: product.details.thirdTab}}} />
                                <div className="product__meta product__meta--grow-30">
                                    <Price salesPrice={item?.price} regularPrice={item?.regularPrice}/>
                                    <AddToCartButton product={ item } input={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Blocks {...product?.details}/>
                    <Related {...relatedProps} />
                    <Related {...kitProps} />
                </div>
            ) : (
                ''
            ) }
        </Layout>
    );
};


export async function getStaticProps(context) {
    const {params: { slug }} = context;
    
    const {data} = await client.query({
        query: PRODUCT_BY_SLUG_QUERY,
        variables: { slug },
    })

    return {
        props: {
            product: data?.product || {},
            menus: data?.menus,
            options: data?.optionsPage?.impostazioni,
            seo: data?.product?.seo ?? '',
            categories: data?.categories?.nodes,
            slug: slug
        },
    };
}

export async function getStaticPaths () {
    const { data } = await client.query({
        query: PRODUCT_SLUGS
    })

    const pathsData = []

    data?.products?.nodes && data?.products?.nodes.map((product) => {
        if (!isEmpty(product?.slug)) {
            pathsData.push({ params: { slug: product?.slug } })
        }
    })

    return {
        paths: pathsData,
        fallback: true
    }
}
