import { isEmpty, isArray } from 'lodash';
import ProductSlider from '../product/ProductSlider';
import Title from '../commons/Title';
import cx from 'classnames';
import Button from '../commons/Button';
import Latests from '../product/Latests';
import Timer from '../commons/Timer';
import { GET_PRODUCTS_TOP, GET_PRODUCTS_NEW, GET_PRODUCTS_SALES } from '../../queries/products/get-products';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

const Products = (props)=> {
    let kind = props.kind,
        slides = kind === 'new' ? 1 : 2,
        timer = props.timer,
        className = cx('columns', 'columns--shrink', 'columns--shrink-left-md', 'columns--grow-140-bottom'),
        title = {
            content: props.title,
            size: 'title--font-size-38',
            type: 'h3'
        },
        button = {
            link: {
                url: '/prodotti/',
                title: 'Vedi tutti',
            },
        };

    const {
        status,
        data: session
    } = useSession();

    // if( ! isEmpty( props.products) ) {
    //     let ids = [];
    //     props.products.forEach((id)=> {
    //         ids.push(parseInt(id));
    //     });
    //     where.include = ids;
    //     where.orderby = [{
    //         field: 'IN',
    //         order: 'ASC'
    //     }];
    //     first =  isArray( props.products ) ? props.products.length : 1;
    // } else {
    //     if(props.kind === 'sales') {
    //         where.orderby = [{
    //             field: 'SALE_PRICE',
    //             order: 'ASC'
    //         }];
    //         where.onSale = true;
    //     } else if (props.kind === 'best') {
    //         where.orderby = [{
    //             field: 'TOTAL_SALES',
    //             order: 'DESC'
    //         }];
    //     }
    // }
    // where.typeIn = [
    //     'SIMPLE',
    //     'VARIABLE'
    // ];
    // where.offsetPagination = {
    //     size: first,
    //     offset: 0,
    // }
    // const [products, setProducts] = useState([]);
    // useEffect(()=> {
    //     (async () => {
    //         const fetchedProducts = await getProducts( where );
    //         setProducts(fetchedProducts.data?.products?.edges || []);
    //     })();
    // }, []);
    
    const object = {
        new : {
            items: props.products?.productsNew?.edges || [],
            fn : GET_PRODUCTS_NEW,
        },
        sales : { 
            items : props.products?.productsSales?.edges || [],
            fn : GET_PRODUCTS_SALES
        },
        best : {
            items: props.products?.productsTop?.edges || [],
            fn: GET_PRODUCTS_TOP,
        }
    }

    const [products, setProducts] = useState( object[kind].items );

    const [ fetchPosts, { data, loading } ] = useLazyQuery( object[kind].fn, {
        notifyOnNetworkStatusChange: true,
        context: {
            headers: {
                'authorization': session?.accessToken ? `Bearer ${session.accessToken}` : '',
            }
        },
        onCompleted: ( ) => {
            let items;
            if( kind === 'new') {
                items = props.products?.productsNew?.edges || [];
            } else if( kind === 'sales') {
                items = props.products?.productsSales?.edges || []
            } else {
                items = props.products?.productsTop?.edges || [];
            }
            setProducts( items );
        },
    } );

    useEffect(()=> {
        if( status === 'authenticated' ) {
            const productsIds = props?.data?.products;
            let where = {
                    orderby : [{
                        field : 'DATE',
                        order: 'DESC',
                    }]
                }, 
                first = kind === 'new' ? 4 : 6;
            if( ! isEmpty( productsIds) ) {
                let ids = [];
                productsIds.forEach((id)=> {
                    ids.push(parseInt(id));
                });
                where.include = ids;
                where.orderby = [{
                    field: 'IN',
                    order: 'ASC'
                }];
                first =  isArray( productsIds ) ? productsIds.length : 1;
            } else {
                if(kind === 'sales') {
                    where.orderby = [{
                        field: 'SALE_PRICE',
                        order: 'ASC'
                    }];
                    where.onSale = true;
                } else if (kind === 'best') {
                    where.orderby = [{
                        field: 'TOTAL_SALES',
                        order: 'DESC'
                    }];
                }
            }
            where.typeIn = [
                'SIMPLE',
                'VARIABLE'
            ];
            where.offsetPagination = {
                size: first,
                offset: 0,
            }
            let key = 'newQuery';
            if(kind === 'sales') {
                key = 'salesQuery';
            } else if (kind === 'best') {
                key = 'topQuery'
            }
            fetchPosts({
                variables: {
                    where: where
                },
            });
        }
    }, [ status ]);

    return (
        <>
        { kind !== 'new' ? (
            <>
            <header className="header header--products header--shrink header--shrink-left-md">
                <Title title={title}/>
                { timer && <Timer timer={timer} />}
                <Button btn={button} />
            </header>
            <div className={className}>
                <div className="column column--products-desc column--s3" dangerouslySetInnerHTML={{ __html: props.content}}></div>
                <div className="column column--products column--products-slider column--s9">
                    <ProductSlider products={products} slides={slides} blockId={props.blockId} loading={loading} />
                </div>
            </div>
            </>
        ) : (
                <Latests data={props} products={products} loading={loading} />
            ) }   
        </>
    );
}

export default Products;



