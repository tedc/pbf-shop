import { useEffect, useState, useContext } from 'react';
import {isEmpty, isUndefined, isNull, isEqual} from 'lodash';
import { useLazyQuery } from '@apollo/client';
import {AppContext} from "../context/AppContext";
import ProductItem from './ProductItem';
import ArchiveNav from './ArchiveNav';
import Filters from './Filters';
import { useRouter } from 'next/router';
import {  GET_PRODUCTS } from '../../queries/products/get-products';
import { productsUrlParams, getQuery } from '../../utils/product';
import { PER_PAGE_FIRST, totalPagesCount, getPageOffset, PER_PAGE_REST, orders } from '../../utils/pagination';
import Pagination from './pagination';
import Title from '../commons/Title';
import cx from 'classnames';
import { useSession } from 'next-auth/react';
import { SpinnerDotted } from 'spinners-react'; 
import ContentProductLoader from './loaders/ContentProduct';
import { unstable_useRefreshRoot as useRefreshRoot } from 'next/streaming'
const ProdutArchive = function(props) {
    const { products, categories, params, pageInfo, pageNo } = props;
    const router = useRouter();
    const { data : session, status } = useSession();
    const refresh = useRefreshRoot()
   
   // const router = useRouter();
    const where = {
        hideOnB2c: false,
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
    }


    const totalProductsCount = pageInfo?.offsetPagination?.total ?? 0;
    const [ pagesCount, setPagesCount ] = useState( Math.ceil( ( totalProductsCount - PER_PAGE_FIRST ) / PER_PAGE_REST + 1 ) );

    const offset = getPageOffset( pageNo );

    where.offsetPagination = { size: PER_PAGE_FIRST, offset: offset };

    const [ items, setItems ] = useState( products );
    const [ args, setArgs ] = useState( where );
    const [ isProductsLoading, setIsProductsLoading ] = useState( cond );
    const [ page, setPage ] = useState( pageInfo );
    const [ searchQuery, setSearchQuery ] = useState( '' );

    if( !isEmpty( searchQuery ) ) {
        where.search = searchQuery;
    }

    const [ fetchPosts, { data, loading } ] = useLazyQuery( GET_PRODUCTS, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'netowrk-only',
        onCompleted: (  ) => {
            setItems( data?.products?.edges ?? {} );
            setPage( data?.products?.pageInfo );
            const totalProductsCount = data?.products?.pageInfo?.offsetPagination?.total ?? 0;
            setPagesCount(  Math.ceil( ( totalProductsCount - PER_PAGE_FIRST ) / PER_PAGE_REST + 1  ) );
            setArgs( where );
            setIsProductsLoading( false );
        },
    } );

    const handleSearchFormSubmit = async ( event ) => {

        event.preventDefault();
        //setIsProductsLoading( true );

        router?.push({
            pathname: '/prodotti',
            query: {
                ...query,
                search: searchQuery
            }
        }, null, {shallow: true})
        //setIsProductsLoading( false );
            
    };

    useEffect( ()=> (async() => {
        if ( '1' === pageNo ) {
            router.push( '/prodotti' );
        }
        if( status === 'authenticated') {
            let getRole;
            session?.user?.roles?.nodes.map((r) => {
                getRole = r?.name !== 'customer' ? r?.name : null;
            });
            if( getRole !== 'customer' ) {
                where.hideOnB2c = true;
                if( getRole === 'wholesaler') {
                    where.wholesalerProduct = true;
                }
            }
        }
        if( searchQuery ) {
            where.search = searchQuery;
        }
        const condition = !isEqual(where, args) ? !isEqual(where, args) : status !== 'loading' && !isEmpty(router?.query, true);
        if( condition  ) {
            if( !isProductsLoading) setIsProductsLoading( true );
            await fetchPosts( {
                variables: {
                    query: where
                }
            } );
        }
    })(), [ query, status ] );
    return (
        <div className={cx('row', 'row--archive') }>
            <ArchiveNav categories={categories} searchQuery={ searchQuery } setSearchQuery={ setSearchQuery } handleSearchFormSubmit={handleSearchFormSubmit} orders={orders} session={session} /> 
            <Filters categories={categories} total={page?.offsetPagination?.total} uparams={uparams} />
            { isNull(session) || isUndefined(session) ? ( <><div className={cx("columns", "columns--archive", {'columns--archive-loading': isProductsLoading })}>  
                {!isEmpty(items) ? items.map((product, index)=> (
                    <div className="column column--s6-sm column--s4-md column--s3-lg"  key={product?.node?.databaseId}>
                        <ProductItem product={product?.node} /> 
                    </div>
                ))
                : (
                    <div className="column column--products-empty">
                        <p><strong>Nessun prodotto trovato per la ricerca effettuata.</strong></p>
                    </div>
                )
                }
            </div>
            <Pagination pagesCount={pagesCount} postName="prodotti" pageNo={pageNo} />
            { isProductsLoading && <SpinnerDotted style={{ color: 'black', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px', zIndex: 3}} /> }
            </>) : (
            <>
                { (isProductsLoading || (status !== 'unauthenticated' && status !== 'authenticated' ) ) && <ContentProductLoader /> }
                { !(isProductsLoading || (status !== 'unauthenticated' && status !== 'authenticated' ) ) && <><div className={cx("columns", "columns--archive", {'columns--archive-loading': isProductsLoading })}>  
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
                <Pagination pagesCount={pagesCount} postName="prodotti" pageNo={pageNo} />
                </> }
            </>
            )}
            
        </div>

    )
}

export default ProdutArchive