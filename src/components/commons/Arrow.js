import {ArrowLeft, ArrowRight} from '../icons';
import {isUndefined, isEmpty} from 'lodash'; 

import Link from 'next/link';
export default function Arrow({side, href}) {
    const Svg = side === 'left' ? ArrowLeft : ArrowRight;
    const className = side === 'left' ? `arrow arrow--left` : 'arrow arrow--right';
    return (
        <>
        {   
            !isEmpty(href) && !isUndefined(href) ? (
                <Link href={href}>
                    <a className={ className }>
                        <Svg />
                    </a>
                </Link>
            ) : (
                <div className={ className }>
                    <Svg />
                </div>
            )
        }
        </>
    )
}

