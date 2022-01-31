import Link from 'next/link';
import PropTypes from 'prop-types';
import {createPaginationLinks, PER_PAGE_FIRST, getPageOffset, PER_PAGE_REST, totalPagesCount} from '../../../utils/pagination';
import cx from 'classnames';
import Previous from './previous';
import Next from './next';

const Pagination = ( {postName, params, pageInfo, query} ) => {
    if ( ! postName ) {
        return null;
    }


    const totalProductsCount = pageInfo?.offsetPagination?.total ?? 0;
    const pagesCount = Math.ceil( ( totalProductsCount - PER_PAGE_FIRST ) / PER_PAGE_REST + 1 );

    const currentPageNo = parseInt( params?.pageNo ) || 1;

    const paginationLinks = createPaginationLinks( currentPageNo, pagesCount );

    return (
        <>
        {  paginationLinks.length > 1 ? (
        <div className="pagination pagination--grow-40-top pagination--grow-80-bottom">

            <Previous currentPageNo={currentPageNo} postName={postName}/>

            {paginationLinks.map( ( pageNo, index ) => {
                const paginationLink = pageNo === 1 ? `/${postName}`: `/${postName}/page/[pageNo]`;
                const q = { ...query, pageNo: pageNo };
                if(pageNo === 1) delete q.pageNo;
                return (
                    'number' === typeof pageNo ? (
                        <Link key={`id-${index}`} href={{
                                pathname: paginationLink,
                                query: q,
                              }}>
                            <a
                                className={cx( 'pagination__link', {
                                    'pagination__link--active': pageNo === currentPageNo
                                } )}
                            >
                                {pageNo}
                            </a>
                        </Link>
                    ) : (
                    // If its "..."
                        <span key={`id-${index}`} className="px-3 py-2">{pageNo}</span>
                    )
                );
            } )}
            <Next currentPageNo={currentPageNo} pagesCount={pagesCount} postName={postName}/>
        </div>
        ) : '' }
        </>
    );
};

Pagination.propTypes = {
    pagesCount: PropTypes.number,
    postName: PropTypes.string,
};

Pagination.defaultProps = {
    pagesCount: 0,
    postName: 'prodotti',
};

export default Pagination;