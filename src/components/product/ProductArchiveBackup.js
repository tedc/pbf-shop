import { useEffect, useState, useContext } from 'react';
import {isEmpty, isUndefined, isNull} from 'lodash';
import { useLazyQuery } from '@apollo/client';
import {AppContext} from "../context/AppContext";
import ProductItem from './ProductItem';
import ArchiveNav from './ArchiveNav';
import Filters from './Filters';
import { withRouter, useRouter } from 'next/router';
import {  GET_PRODUCTS } from '../../queries/products/get-products';
import { productsUrlParams, getQuery } from '../../utils/product';
import { PER_PAGE_FIRST, totalPagesCount, getPageOffset, PER_PAGE_REST } from '../../utils/pagination';
import Pagination from './pagination';
import Title from '../commons/Title';
import cx from 'classnames';
const ProdutArchive = function(props) {
    const { products, categories, params, pageInfo } = props;
    const router = useRouter();
    const orders = {
        'recent' : {
            label: 'Più recenti',
            fields : [{
                field : 'DATE',
                order: 'DESC',
            }]
        },
        'older' : {
            label: 'Meno recenti',
            fields : [{
                field : 'DATE',
                order: 'ASC',
            }]
        },
        'higher_price' : {
            label: 'Più costosi',
            fields : [{
                field : 'PRICE',
                order: 'DESC',
            }]
        },
        'lower_price' : {
            label: 'Meno costosi',
            fields : [{
                field : 'PRICE',
                order: 'ASC',
            }]
        },
        'best' : {
            label: 'Più venduti',
            fields : [{
                field : 'TOTAL_SALES',
                order: 'DESC',
            }]
        },
        'az' : {
            label: 'A-Z',
            fields : [{
                field : 'SLUG',
                order: 'ASC',
            }]
        },
        'za' : {
            label: 'Z-A',
            fields : [{
                field : 'SLUG',
                order: 'DESC',
            }]
        },
    }
   // const router = useRouter();
    const where = {
        orderby : [{
            field : 'DATE',
            order: 'DESC',
        }],
        typeIn: [
            'SIMPLE',
            'VARIABLE'
        ],
    }
    
    let cond = false;
    const uparams = productsUrlParams(router);
    const query = process.browser && getQuery() ? (router?.query) : {};

    params.map((p)=> {
        if(uparams !== false) {
            //const rgx = new RegExp(`(${p})`);
            if(!isUndefined(uparams[p])) {
                query[p] = uparams[p];
                cond = true;
            }
        }
    });

    for(const order in orders) {
        if(!isUndefined(uparams.order)) {
            if(uparams.order === order) {
                query.order = order;
                cond = true;
            }
        }
    }
        
    if(!isEmpty(query, true)) {
        for(const param in query) {
            if(params.indexOf(param) !== -1) {
                 if(isUndefined(where.taxonomyFilter)) {
                    where.taxonomyFilter = {
                        filters : [],
                        relation : 'OR',
                    }
                }
                where.taxonomyFilter.filters.push({
                    taxonomy: 'PRODUCTCATEGORY',
                    terms: query[param] === 'all' ? param : query[param].split(','),
                })
            }
        }
        if(!isUndefined(query.order)) {
            where.orderby = orders[query.order].fields;
        }

        // for(const order in orders) {
        //     console.log(order, params, params.indexOf(order));
        //     if(params.indexOf(order) !== -1) {
        //         where.orderby = [
        //             orders[order].fields
        //         ]
        //     }
        // }
    }

    console.log( products)

    const [ items, setItems ] = useState( products );
    const [ args, setArgs ] = useState( where );
    const [ isLoading, setIsLoading ] = useState( cond );
    const [ page, setPage ] = useState( pageInfo );
    const [ searchQuery, setSearchQuery ] = useState( '' );

    const totalProductsCount = pageInfo?.offsetPagination?.total ?? 0;
    const [ pagesCount, setPagesCount ] = useState( Math.ceil( ( totalProductsCount - PER_PAGE_FIRST ) / PER_PAGE_REST + 1 ) );

    const [ fetchPosts, { loading } ] = useLazyQuery( GET_PRODUCTS, {
        notifyOnNetworkStatusChange: true,
        onCompleted: ( data ) => {
            setItems( data?.products?.edges ?? {} );
            setPage( data?.products?.pageInfo );
            const totalProductsCount = data?.products?.pageInfo?.offsetPagination?.total ?? 0;
            setPagesCount(  Math.ceil( ( totalProductsCount - PER_PAGE_FIRST ) / PER_PAGE_REST + 1  ) );
            setIsLoading( loading );
        },
        onError: ( error ) => {
            console.log(error)
            //setSearchError( error?.graphQLErrors ?? '' );
        }
    } );

    const handleSearchFormSubmit = ( event ) => {

        event.preventDefault();
        setIsLoading( false );

        // if ( isEmpty( searchQuery ) ) {
        //   setSearchError( 'Please enter text to search' );
        //   setQueryResultPosts( {} );
        //   return null;
        // }

        // setSearchError( '' );

        where.search = searchQuery;
        setArgs( where );

        fetchPosts( {
          variables: {
            after: null,
            query: where
          }
        } );
    };

    // Redirecting to /blog if we are on page 1
    const pageNo = router?.query?.pageNo ?? 1;
    const offset = getPageOffset( pageNo );

    where.offsetPagination = { size: PER_PAGE_FIRST, offset: offset };
    
    // useEffect( ()=> (async() => {
    //     if ( '1' === pageNo ) {
    //         router.push( '/prodotti' );
    //     }
    //     await fetchPosts( {
    //         variables: {
    //             query: where
    //         }
    //     } );

    // })(), [ query ] );
    // useEffect(()=> {
    //     console.log( products );
    //     // (async () => {
    //     //      if ( '1' === pageNo ) {
    //     //             let q = router.query;
    //     //             delete q.pageNo;
    //     //             router.push( '/prodotti', {query : q} );
    //     //         }
    //     //         await fetchPosts( {
    //     //             variables: {
    //     //                 query: where
    //     //             }
    //     //         } );
    //     // })();
    // }, [items]);
    return (
        <div className="row row--archive">
            <ArchiveNav categories={categories} searchQuery={ searchQuery } setSearchQuery={ setSearchQuery } handleSearchFormSubmit={handleSearchFormSubmit} orders={orders} /> 
            <Filters categories={categories} total={page?.offsetPagination?.total} uparams={uparams} />
            <div className={cx("columns", "columns--archive")}>  
                {!isEmpty(items) ? items.map((product, index)=> (
                    <div className="column column--s6-sm column--s4-md column--s3-lg"  key={product.node.databaseId}>
                        <ProductItem product={product.node} /> 
                    </div>
                ))
                : (
                    <div className="column column--products-empty">
                        <p><strong>Nessun prodotto trovato per la ricerca effettuata.</strong></p>
                    </div>
                )
                }
            </div>
            <Pagination pagesCount={pagesCount} setPageCount={setPagesCount} postName="prodotti" />
        </div>

    )
}

export default ProdutArchive