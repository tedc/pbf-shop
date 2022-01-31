import { productsUrlParams } from '../../utils/product';
import { orders } from '../../utils/pagination';
import { isEmpty, isUndefined} from 'lodash';
import { useState, useEffect, useRef} from 'react';
import { useRouter} from 'next/router';
import Link from 'next/link';
import cx from 'classnames';
export default function OrderMenu() {
    const router = useRouter();
    const boxRef = useRef();
    const uparams = productsUrlParams(router);
    const [ currentParam, setCurrentParam] = useState('recent');
    const [ open, setOpen ] = useState( false );
    useEffect( ()=> {
        for(const order in orders) {
            if(router.asPath.indexOf(order) !== -1) {
               setCurrentParam(order);
            }
        }
    }, [ uparams ]);
    return (
        <div className={cx("nav__order", {'nav__order--active': open})} onClick={(event)=> setOpen(!open)}>
            Ordina per <span>{orders[currentParam].label}</span>
            <ul>
                <>
                {
                    Object.entries(orders).map((array, index) => {
                        const key = array[0];
                        const item = array[1];
                        const query = !isEmpty(uparams, true) ? uparams : {};
                        let q = {};   
                        if(isUndefined(query.order)) {
                            q.order = key;
                        } else {
                            const idx = query.order.indexOf(key);
                            if(idx === -1) {
                                q.order = key;
                            } else {
                                delete q.order;
                                delete query.order;
                            }
                        }
                        q = {...query, ...q};
                        return (
                            <li key={`${item.label}-${index}`}>
                                <Link href={{
                                    pathname: '/prodotti',
                                    query: q,
                                }}>
                                    <a className="nav__order-item">{item.label}</a>
                                </Link>
                            </li>
                        )
                    })
                }
                </>
            </ul>
        </div>
    )
}