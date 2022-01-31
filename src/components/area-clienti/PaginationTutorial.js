import Link from 'next/link';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import {createPaginationLinks} from '../../../utils/pagination';
import cx from 'classnames';
import Previous from './previous';
import Next from './next';

const Pagination = ( {pagesCount, postName} ) => {
    if ( ! pagesCount || ! postName ) {
        return null;
    }

    const router = useRouter();
    const currentPageNo = parseInt( router?.query?.pageNo ) || 1;

    const paginationLinks = createPaginationLinks( currentPageNo, pagesCount );

    return (
        <>
        {  paginationLinks.length > 1 ? (
        <div className="pagination pagination--grow-40-top pagination--grow-80-bottom">

            <Previous currentPageNo={currentPageNo} postName={postName}/>

            {paginationLinks.map( ( pageNo, index ) => {
                const paginationLink = pageNo === 1 ? `/${postName}`: `/${postName}`;
                const q = { ...router.query, pageNo: pageNo };
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