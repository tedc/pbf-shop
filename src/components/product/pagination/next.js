import {isEmpty} from 'lodash';
import Link from 'next/link';
import Arrow from '../../commons/Arrow';
const Next = ( {currentPageNo, pagesCount, postName, query} ) => {

    if ( ! currentPageNo || ! pagesCount || isEmpty( postName ) ) {
        return null;
    }

    // If you are on the last page, dont show next link.
    if ( pagesCount < currentPageNo + 1 ) {
        return null;
    }

    const pageNo = currentPageNo + 1;
    const paginationLink = pageNo === 1 ? `/${postName}`: `/${postName}/page/[pageNo]`;
    const q = { ...query, pageNo: pageNo };
    if(pageNo === 1) delete q.pageNo;
    return (
        <Link href={{
            pathname: paginationLink,
            query: q,
          }}>
            <a className="pagination__next">
                <Arrow side="right"/>
            </a>
        </Link>
    );
};

export default Next;