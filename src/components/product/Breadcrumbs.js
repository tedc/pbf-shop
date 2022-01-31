import {isEmpty, isUndefined} from 'lodash';
import Link from 'next/link';
import Arrow from '../commons/Arrow';
import cx from 'classnames';
export default function Breadcrumbs({breadcrumbs, name}) {
    if(isEmpty(breadcrumbs)) {
        return;
    }
    const Blink = ({href, name}) => (
        <>
            <Link  href={href}>
                <a className="breadcrumbs__link">{name}</a>
            </Link>
            <span className="sep">&frasl;</span>
        </>
    )
    return (
        <div className="breadcrumbs">
            <Link href="/prodotti/">
                <a className="back">
                    <Arrow side="left"/>
                    Torna allo shop
                </a>
            </Link>
            {
                breadcrumbs.map((crumb, index) => {
                    const key = `${crumb.slug}-${index}`;
                    const href = crumb.link !== '/prodotti/' ? {pathname: '/prodotti', query : {
                                    [crumb.base] : crumb.link
                                }} : { pathname: '/prodotti'};
                    return (
                        <Blink href={href} name={crumb.name} key={key} />
                    )
                })
            }
            {name}
        </div>
    )
}