import {isEmpty} from 'lodash';
import Link from 'next/link';
import Arrow from '../../commons/Arrow';
import { useRouter } from 'next/router';

const Previous = ( {currentPageNo, postName} ) => {

    if ( ! currentPageNo || isEmpty( postName ) ) {
        return null;
    }

    // If you are on the first page, dont show previous link.
    if ( 0 === currentPageNo - 1 ) {
        return null;
    }

    const router = useRouter();
    const pageNo = currentPageNo - 1;
    const paginationLink = pageNo === 1 ? `/${postName}`: `/${postName}/page/[pageNo]`;
    const q = { ...router.query, pageNo: pageNo };
    if(pageNo === 1) delete q.pageNo;

    return (
        <Link href={{
            pathname: paginationLink,
            query: q,
          }}>
            <a className="pagination__prev"><Arrow side="left" /></a>
        </Link>
    );
};

export default Previous;