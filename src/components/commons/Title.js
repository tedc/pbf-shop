import { isEmpty, isUndefined } from 'lodash';
import cx from 'classnames';
export default function Title({title}) {
    const Heading = isEmpty(title?.type) ? 'h1' : title?.type;
    const className = cx('title', title?.size);
    return (<>
        { isUndefined(title?.fn) ? (<Heading className={className} dangerouslySetInnerHTML={{__html : title?.content}}></Heading> ) : (<Heading className={className} dangerouslySetInnerHTML={{__html : title?.content}} onClick={title.fn}></Heading>)}     
      </>  
    )
}