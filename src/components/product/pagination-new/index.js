import Link from 'next/link';
import PropTypes from 'prop-types';
import {createPaginationLinks, PER_PAGE_FIRST, getPageOffset, PER_PAGE_REST, totalPagesCount} from '../../../utils/pagination';
import cx from 'classnames';
import Previous from './previous';
import Next from './next';
import { useRouter } from 'next/router';
import { productsUrlParams } from '../../../utils/product';

const Pagination = ( {postName, pagesCount, pageNo } ) => {
    if ( ! postName ) {
        return null;
    }
    const router = useRouter();
    const query = productsUrlParams(router);
    const currentPageNo = parseInt( pageNo ) || 1;
    const paginationLinks = createPaginationLinks( currentPageNo, pagesCount );
    return (
        <>
        {  paginationLinks.length > 1 && pagesCount > 1 ? (
        <div className="pagination pagination--grow-40-top pagination--grow-80-bottom">

            <Previous currentPageNo={currentPageNo} postName={postName} query={query}/>

            {paginationLinks.map( ( pageNo, index ) => {
                const paginationLink = pageNo === 1 ? `/${postName}`: `/${postName}`;
                const q = { ...query, page: pageNo };
                //if(pageNo === 1) delete q.page;
                return (
                    'number' === typeof pageNo ? (
                        <Link key={`id-${index}`} href={{ pathname: paginationLink, query: q }}  shallow>
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
                        <span key={`id-${index}`}>{pageNo}</span>
                    )
                );
            } )}
            <Next currentPageNo={currentPageNo} pagesCount={pagesCount} postName={postName} query={query} />
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