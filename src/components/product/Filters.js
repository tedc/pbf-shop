import { isEmpty, isUndefined} from 'lodash';
import { productsUrlParams } from '../../utils/product';
import { useRouter } from 'next/router';
import Link from 'next/link';
export default function Filters(props) {
    const { categories, total } = props;
    const router = useRouter();
    
    const uparams = productsUrlParams(router);
    if(isEmpty(uparams, true)) {
        return '';
    }
    const filters = [];
    categories.map((cat)=> {
        const current = uparams[cat.slug];
        const parent = cat.slug;
        const children = cat.children.nodes;
        if(!isUndefined(current)) {
            const array = current.split(',');
            if(array.indexOf('all') !== -1) {
                const query = Object.assign({}, uparams);
                delete query[cat.slug];
                filters.push({
                    filter: cat.slug,
                    query : query,
                    label : `${cat.name}: tutti`
                });
            }
            if( !isEmpty(children) ) {
                children.map((child)=> {

                    // const query = Object.assign({}, uparams);
                    // const idx = array.indexOf(child.slug);
                    const query = !isEmpty(uparams, true) ? Object.assign({}, uparams) : {};
                    const q = {};   
                    const split = query[parent].split(',');
                    const idx = split.indexOf(child.slug);
                    if(isUndefined(query[parent])) {
                        q[parent] = [child.slug];
                    } else {
                        if(idx === -1) {
                            split.push(child.slug);
                        } else {
                            split.splice(idx, 1);
                        }
                        if(split.indexOf('all') !== -1) {
                            split.splice(split.indexOf('all'), 1);
                        }
                        if(split.length < 1) {
                            delete q[parent];
                            delete query[parent];
                        } else {
                             q[parent] = split.join(',');
                        }
                    }
                    //if(parent === 'colore') console.log(q, query);
                    const queryUrl = {...query, ...q};
                    if(array.indexOf(child.slug) !== -1) {
                        array.splice(idx, 1);
                        if(array.length < 1) {
                            delete query[cat.slug];
                        }
                        filters.push({
                            filter: cat.slug,
                            query : queryUrl,
                            label : child.name,
                        });
                    }
                })
            }
        }
    });
    if(isEmpty(filters)) {
        return '';
    }
    const title = total > 1 ? 'prodotti trovati' : 'prodotto trovato'; 
    return (
        <div className="filters filters--shrink">
            <span>{total} {title}</span>
            <>
            {
                filters.map((filter, index)=> (
                    <Link href={{
                        pathname: '/prodotti',
                        query: filter.query,
                    }} shallow key={`${filter.label}-${index}`}>
                        <a className="button button--bg-black button--rounded button--rounded-filter" dangerouslySetInnerHTML={{__html: `${filter.label}<i></i>`}}></a>
                    </Link>
                ))
            }
            </>
        </div>
    )
}