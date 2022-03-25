import {isEmpty} from 'lodash';
import Link from 'next/link';
import Arrow from '../../commons/Arrow';

const Previous = ( {currentPageNo, postName, query} ) => {

    if ( ! currentPageNo || isEmpty( postName ) ) {
        return null;
    }

    // If you are on the first page, dont show previous link.
    if ( 0 === currentPageNo - 1 ) {
        return null;
    }
    const pageNo = currentPageNo - 1;
    const paginationLink = pageNo === 1 ? `/${postName}`: `/${postName}`;
    const q = { ...query, page: pageNo };
    //if(pageNo === 1) delete q.page;
    return (
        <Link href={{
            pathname: paginationLink,
            query: q,
          }} shallow>
            <a className="pagination__prev"><Arrow side="left" /></a>
        </Link>
    );
};

export default Previous;