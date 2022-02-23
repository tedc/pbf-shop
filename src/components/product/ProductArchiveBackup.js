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
    const { products, categories, params, pageInfo, query, session } = props;
    const router = useRouter();
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

    const [ isLoading, setIsLoading ] = useState( false );
    const [ page, setPage ] = useState( pageInfo );
    const [ searchQuery, setSearchQuery ] = useState( query?.search ?? '' );

    const totalProductsCount = pageInfo?.offsetPagination?.total ?? 0;
    const [ pagesCount, setPagesCount ] = useState( Math.ceil( ( totalProductsCount - PER_PAGE_FIRST ) / PER_PAGE_REST + 1 ) );


    const handleSearchFormSubmit = ( event ) => {

        event.preventDefault();

        router.push({
            href: '/prodotti',
            query : {...query, ...{ search: searchQuery}}
        })
        setIsLoading( false );

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
            <ArchiveNav categories={categories} searchQuery={ searchQuery } setSearchQuery={ setSearchQuery } handleSearchFormSubmit={handleSearchFormSubmit} session={session} /> 
            <Filters categories={categories} total={page?.offsetPagination?.total} />
            <div className={cx("columns", "columns--archive")}>  
                {!isEmpty(products) ? products.map((product, index)=> (
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
            <Pagination pageInfo={pageInfo} pagesCount={pagesCount} setPageCount={setPagesCount} query={query} params={params} postName="prodotti" />
        </div>

    )
}

export default ProdutArchive