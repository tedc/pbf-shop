import { useEffect, useState, useContext } from 'react';
import {isEmpty, isUndefined, isNull, isEqual, filter, intersection, orderBy, chunk, includes, reverse} from 'lodash';
import { useLazyQuery } from '@apollo/client';
import {AppContext} from "../context/AppContext";
import ProductItem from './ProductItem';
import ArchiveNav from './ArchiveNav';
import Filters from './Filters';
import { useRouter } from 'next/router';
import {  GET_PRODUCTS } from '../../queries/products/get-products';
import { productsUrlParams, getQuery } from '../../utils/product';
import { PER_PAGE_FIRST, totalPagesCount, getPageOffset, PER_PAGE_REST, orders } from '../../utils/pagination';
import Pagination from './pagination-new';
import Title from '../commons/Title';
import cx from 'classnames';
import { useSession } from 'next-auth/react';
import { SpinnerDotted } from 'spinners-react'; 
import ContentProductLoader from './loaders/ContentProduct';

const FilterProducts = (props)=> {
    const {
        setArgs, query, productsData, hideOnB2c, wholesalerProduct, session, role, categoryIds, setIsProductsLoading, setItems, setPageNo, setPagesCount, setTotalItems
    } = props;
    setIsProductsLoading( true );
    let ids = [],
        items = [...productsData];
        
    for(let key in query) {
        if( key !== 'order' && key !== 'search' && key !== 'page') {
            const value = query[key].split(',');
            value.map((item)=> {
                const v = item === 'all' ? key : item;
                const current = categoryIds[v];
                ids.push(current);
            })      
        }
    }

    if( !isEmpty(ids) ) {
        items =  filter(items, (p)=>  intersection(ids, p?.productCategoriesIds).length > 0 );
    }
    if( !hideOnB2c ) {
        items = filter(items, (p)=> p?.details.hideOnB2c !== true )
    }
    
    items = filter(items, (p)=> p?.details.wholesalerProduct !== !wholesalerProduct)

    if( session ) {
        if( role !== 'customer') {
            items = filter(items, (p)=> {
                let visible = false;
                if( p?.userVisibility) {
                    p?.userVisibility.map((uItem)=> {
                        if( uItem?.id === session?.user?.databaseId || uItem?.key === role) {
                            visible = true;
                        }
                    });
                }
                return visible;
            })
        }
    }

    if( !isUndefined(query?.search) ) {
        items = filter(items, (p)=> p?.name?.match(new RegExp(query?.search, "i")) || p?.categoryName?.match(new RegExp(query?.search, "i")))
    }
    setTotalItems( items );
    setPageNo( query?.page ?? 1 );
    setPagesCount( Math.ceil( ( items?.length - PER_PAGE_FIRST ) / PER_PAGE_REST + 1 ) );
    if( !isEmpty(items ) ) {
        if( !isUndefined(query.order) ) {
            const order = query.order
            let orderKey = 'date',
                dir = 'asc';
            if( order === 'lower_price' || order === 'higher_price' ) {
                orderKey = 'price';
            } else if(order === 'best') {
                orderKey = 'totalSales'
            } else if( order === 'az' || order === 'za') {
                orderKey = 'name';
            }

            if( order === 'higher_price' || order === 'best' || order === 'za') {
                dir = 'desc';
            }
            if( orderKey == 'price' ) {
                items = orderBy(items, o => parseFloat( o?.price?.replace('€', '') ), dir);
            } else {
                items = orderBy(items, orderKey, dir );
            }
            
        }
        if( items.length > PER_PAGE_FIRST) {
            items = chunk(items, PER_PAGE_FIRST);
            if( !isUndefined(query.page) ) {
                const index = parseInt( query.page ) - 1;
                items = items[index];
            } else {
                items = items[0];
            }
        }
    }


    setItems( items );
    setIsProductsLoading( false );
    setArgs( query );
}

const ProdutArchive = function(props) {
    const { products, categories, params, productsData } = props;
    const router = useRouter();
    const { data : session, status } = useSession();
    const categoryIds = {};
    categories.map((cat)=> {
        categoryIds[cat?.slug] = cat?.databaseId;
        if(!isEmpty(cat?.children?.nodes)) {
            cat?.children?.nodes?.map((c)=> {
                categoryIds[c?.slug] = c?.databaseId;
            })
        }
    })
   // const router = useRouter();
    
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
    const [ totalItems, setTotalItems ] = useState( productsData );
    const [ items, setItems ] = useState( products );
    const totalProductsCount = productsData?.length ?? 0;
    const [ pagesCount, setPagesCount ] = useState( Math.ceil( ( totalProductsCount - PER_PAGE_FIRST ) / PER_PAGE_REST + 1 ) );
    const [ pageNo, setPageNo ] = useState(query?.page ?? 1);
    const [ args, setArgs ] = useState({});
    
    const [ isProductsLoading, setIsProductsLoading ] = useState( cond );
    const [ searchQuery, setSearchQuery ] = useState( '' );
    
    const handleSearchFormSubmit = async ( event ) => {

        event.preventDefault();
        //setIsProductsLoading( true );

        const q = {...query};
        if( !isEmpty(searchQuery) ) {
            q?.search = searchQuery;
        } else {
            if( !isUndefined(q?.search) ) {
                delete q.search;
            }
        }

        router?.push({
            pathname: '/prodotti',
            query: {
                ...q
            }
        }, null, {shallow: true})
        //setIsProductsLoading( false );
    };

    useEffect( ()=> (async() => {
        let getRole,
            hideOnB2c = false,
            wholesalerProduct = false;
             
        if( status === 'authenticated') {
            session?.user?.roles?.nodes.map((r) => {
                getRole = r?.name !== 'customer' ? r?.name : null;
            });
            if( getRole !== 'customer' ) {
                hideOnB2c = true;
                if( getRole === 'wholesaler') {
                    wholesalerProduct = true;
                }
            }
        }
        const filterProps = {query, setArgs, productsData, hideOnB2c, wholesalerProduct, session, getRole, categoryIds, setIsProductsLoading, setItems, setPageNo, setPagesCount, setTotalItems}
        if( status === 'authenticated' || !isEqual(query, args)) {
            window.scrollTo(0, 0);
             FilterProducts(filterProps);
        }
        if ( !isUndefined(query?.page) ) {
            const q = {
                ...query
            }
            if( q?.page === '1' ) {
                delete q?.page;
                router.push( { pathname: '/prodotti', query: q}, null, {shallow: true} );
            }
            
        }
        if( items.length === 0 && !isUndefined(query?.page)) {
            router.push( { pathname: '/prodotti', query: q}, null, {shallow: true} );
        }
    })(), [ query, status ] );
    return (
        <div className={cx('row', 'row--archive') }>
            <ArchiveNav categories={categories} totalItems={totalItems} searchQuery={ searchQuery } setSearchQuery={ setSearchQuery } handleSearchFormSubmit={handleSearchFormSubmit} orders={orders} session={session} /> 
            <Filters categories={categories} total={totalItems.length} uparams={uparams} />
            { isNull(session) || isUndefined(session) ? ( <><div className={cx("columns", "columns--archive", {'columns--archive-loading': isProductsLoading })}>  
                {!isEmpty(items) ? items.map((product, index)=> (
                    <div className="column column--s6-sm column--s4-md column--s3-lg" key={`${product?.databaseId}-${index}`}>
                        <ProductItem product={product} /> 
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
                        <div className="column column--s6-sm column--s4-md column--s3-lg" key={`${product?.databaseId}-${index}`}>
                            <ProductItem product={product} /> 
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