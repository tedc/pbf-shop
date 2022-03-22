import { useRouter } from 'next/router';
import AddToCartButton from '../cart/AddToCartButton';
import {PRODUCT_BY_SLUG_QUERY} from '../../queries/products/get-product';
import {GET_PRODUCTS} from '../../queries/products/get-products';
import { isEmpty, isNull, isUndefined } from 'lodash';
import GalleryCarousel from "../single-product/gallery-carousel";
import Price from "../single-product/price";
import Title from "../commons/Title";
import Related from "../product/Related";
import Breadcrumbs from "../product/Breadcrumbs";
import Tabs from "../product/Tabs";
import Blocks from "../product/Blocks";
import Image from "../../image";
import { useSession } from 'next-auth/react';
import { useLazyQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import cx from 'classnames';
import { SpinnerDotted } from 'spinners-react';
import { CSSTransition } from 'react-transition-group';
import Link from 'next/link';

export default function SingleProduct(props) {
    const { product, slug } = props;
    const router = useRouter();
    const { data : session, status } = useSession();
    const [ role, setRole ] = useState(null);
    const [ item, setItem ] = useState( product );
    const [ isLoading, setIsLoading ] = useState(false);
    const [ wholesaler, setWholesaler] = useState(null);

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    if( isNull( session ) || status === 'unauthenticated') {
        if( product?.details?.hideOnB2c) {
            router?.push('/');
        }
    }
    const title = {
        content: product.name,
        size: product?.sku ? 'title--font-size-38 title--grow-30-top' : 'title--font-size-38 title--grow-30',
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
                    if( isNull( a?.ancestors ) ) {
                        base = a?.slug;
                    } else {
                        base =  a?.ancestors?.nodes[0]?.slug;
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

    const [ refetchProduct, { loading } ] = useLazyQuery( PRODUCT_BY_SLUG_QUERY, {
        notifyOnNetworkStatusChange: true,
        onCompleted: ( data ) => {
            
            setItem( data?.product ?? {} );
            setIsLoading( false );
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
    } );

    useEffect( ()=> (async() => {
        if( status === 'authenticated') {
            let getRole;
            session?.user?.roles?.nodes.map((r) => {
                getRole = r?.name !== 'customer' ? r?.name : null;
            });
            if( getRole !== 'customer' && getRole !== 'administrator' && !isNull(getRole) ) {
                setIsLoading( true );  
                if( getRole === 'hairdresser') {
                    setWholesaler( session?.user?.parentName );
                }
            }
            if( !isNull( product?.userVisibility ) && getRole !== 'customer' && getRole !== 'administrator' && !isNull(getRole) ) {
                let visible = false;
                const array = [];
                product?.userVisibility.map((uItem)=> {
                    if( uItem?.id === session?.user?.databaseId || uItem?.key === role) {
                        visible = true;
                        if( uItem?.qty ) {
                            setItem({
                                ...item,
                                stock : uItem?.qty
                            });
                        }
                    }
                });
                if(!visible) {
                    router.push('/');
                }
            }
            setRole( getRole );
            if(  getRole !== 'customer' ) {
                if( getRole !== 'wholesaler' && product?.details?.wholesalerProduct ) {
                    router?.push('/');
                } 
                await refetchProduct({variables: { slug } });
            } else {
                setIsLoading( false );
                if( product?.details?.hideOnB2c) {
                    router?.push('/');
                }
            }
        }
    })(), [ status ]);
    return (
        <div className={cx('product', 'product--single', { 'product--single-loading' : isLoading})}>
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
                        <Price salesPrice={item?.price} regularPrice={item?.regularPrice} discount={true} />
                        { mainCategory && <Link href={{pathname:'/prodotti', query: { [mainCategory.link] : 'all'}}}><a className="product__category" dangerouslySetInnerHTML={{__html: mainCategory.name}}></a></Link> }
                        <Title title={title}/>
                        { product?.sku && <span className="product__sku">Cod: {product?.sku}{ wholesaler && <> / Grossita: <strong dangerouslySetInnerHTML={{__html:wholesaler}}></strong></>}</span>}
                        
                        { product?.shortDescription && <div

                            dangerouslySetInnerHTML={ {
                                __html: product.shortDescription,
                            } }
                            className="product__description product__description--grow-30-bottom"
                        /> }
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
            <div className="product__fixed">
                <Price salesPrice={item?.price} regularPrice={item?.regularPrice}/>
                <AddToCartButton product={ item } input={false} />
            </div>
            <CSSTransition in={ isLoading }  timeout={750} classNames="fade-in" unmountOnExit>
                <SpinnerDotted style={{ color: 'black', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px', zIndex: 3}} />
            </CSSTransition>
            <style jsx>{`.fade-in-enter {
                opacity: 0;
                visibility: hidden;
            }
            .fade-in-enter-active {
                opacity: 1;
                visibility: visible;
                transition: opacity .75s;
            }
            .fade-in-enter-done {
                visibility: visible;
                opacity: 1;
            }
            .fade-in-exit {
                visibility: visible;
                opacity: 1;
            }
            .fade-in-exit-active {
                visibility: visible;
                opacity: 0;
                transition: opacity .75s;
            }
            .fade-in-exit-done {
                visibility: hidden;
                opacity: 0;
            }`}</style>
        </div>
    )
}