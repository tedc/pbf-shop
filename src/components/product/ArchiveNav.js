import { gsap } from 'gsap/dist/gsap';
import { useEffect, useState, useRef, useContext } from 'react';
import {isEmpty, isUndefined, isNull, isArray} from 'lodash';
import {AppContext} from "../context/AppContext";
import cx from 'classnames';
import Search from './Search';
import OrderMenu from './OrderMenu';
import Link from 'next/link';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';
//import { GET_CATEGORIES } from '../../queries/products/get-categories';
import Title from '../commons/Title';
import { productsUrlParams } from '../../utils/product';


const SubNav = (props)=> {
    const router = useRouter();
    const {items, state, id, show, shrink, parent} = props;
    if(isEmpty(items)) {
        return '';
    }
    const uparams = productsUrlParams(router);

    const navRef = useRef();

    let parentQuery = {};
    
    if(isUndefined(uparams[parent])) {
        parentQuery[parent] = 'all';
    } else {
        if(uparams[parent] === 'all') {
            delete parentQuery[parent];
        } else {
            parentQuery[parent] = 'all';
        }
    }

    if(!isEmpty(uparams, true)) {
        const query = Object.assign({}, uparams);
        if(!isUndefined(query[parent])) {
            delete query[parent];
        }
        parentQuery = {...parentQuery, ...query};
    }

    useEffect(()=> {
        if(!show) return;
        const isEl = state === id;
        const list = navRef.current;
        const other = document.querySelector(`.nav__children--active:not([data-subnav="${id}"])`);
        const otherExist = !isNull(other) && !isEmpty(other) && !isUndefined(other);
        if(!isEl) {
            if(list.classList.contains('nav__children--active')) {
                gsap.to(list, {
                    height: 0,
                    duration: .5,
                    onComplete() {
                        gsap.set(list, {
                            clearProps: 'height',
                        })
                        list.classList.remove('nav__children--active')
                    }
                })
            }
        } else {
            if(otherExist) {
                gsap.to(other, {
                    height: 0,
                    duration: .5,
                    onComplete() {
                        gsap.set(other, {
                            clearProps: 'height',
                        })
                        other.classList.remove('nav__children--active')
                    }
                })
            }
            list.classList.add('nav__children--active')
            const height = list.offsetHeight;
            gsap.set(list, {
                height: 0,
            })
            gsap.to(list, {
                height: height,
                delay: otherExist ? .5 : 0,
                duration: .5,
            })
        }
    }, [ state ]);
    return (
        <>
        {
            show ? (
            <div className={cx("nav__children", {"nav__children--shrink" : shrink})} ref={navRef} data-subnav={id}>
            <ul>
                <li>
                    <Link href={{
                        pathname: '/prodotti',
                        query: parentQuery,
                    }} >
                        <a className={ cx( 'nav__link', {'nav__link--active' : isUndefined(parentQuery[parent]) } ) }>Tutti</a>
                    </Link>
                </li>
                <>
                {
                    items.map(function(item, index) {
                        const query = !isEmpty(uparams, true) ? Object.assign({}, uparams) : {};
                        const q = {};   
                        let classname = cx('nav__link');
                        if(isUndefined(query[parent])) {
                            q[parent] = [item.slug];
                        } else {
                            const split = query[parent].split(',');
                            const idx = split.indexOf(item.slug);
                            if(idx === -1) {
                                split.push(item.slug);
                            } else {
                                split.splice(idx, 1);
                                classname = cx(classname, 'nav__link--active');
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
                        return (
                            <li key={item.slug}><Link href={{
                                pathname: '/prodotti',
                                query: queryUrl,
                            }}  key={item.databaseId}>
                                <a className={classname} dangerouslySetInnerHTML={{ __html: item.name}}></a>
                            </Link>
                            </li>
                        )
                    })
                }
                </>
            </ul>
            </div>
        )
        : ''}
        </>
    )
}

export default function ArchiveNav({categories,searchQuery, setSearchQuery, handleSearchFormSubmit, session}) {
    const [ state, setState ] = useState( null );
    const [ media, setMedia ] = useState( false )
    const router = useRouter();
    
    const uparams = productsUrlParams(router);

    let NavTitle = () => <Title title={{
                        content: 'Le mie esigenze',
                        type: 'h2',
                        size: 'title--font-size-38'
                    }} />

    const [ role, setRole ] = useState( null );
   
   
    const setNavState = (id)=> {
        const v = state === id ? false : id;
        setState( v )
    }
    useEffect(() => {
         if( session?.user ) {
            session?.user?.roles?.nodes.map((r) => {
                setRole( r?.name !== 'customer' ? r?.name : null )
            })
        }
        const vw = 87.875;
        const matchMin = window.matchMedia(`(min-width:${vw}em)`);
        setMedia( matchMin.matches );
        window.addEventListener('resize', () => {
            const matchMin = window.matchMedia(`(min-width:${vw}em)`);
            setMedia( matchMin.matches );
        })
    }, [ ])
    return (
        <div className="header header--archive">
            <nav className="nav nav--archive nav--grow-30 nav--bg-black nav--shrink">
                { role === 'wholesaler' || role === 'hairdresser' ? (
                    <div className="nav__header">
                        <h5 className='title title--upper' style={{marginBottom: 10, fontSize: 9}}>Benvenuto</h5>
                        <Title title={{
                            content: session?.user?.nicename,
                            type: 'h2',
                            size: 'title--font-size-38'
                        }} />
                    </div>
                ) : (<Title title={{
                    content: 'Le mie esigenze',
                    type: 'h2',
                    size: 'title--font-size-38'
                }} />) }
                
                <ul className="nav__list">
                    {
                        categories.map((category) => {
                            if(!isEmpty(category.children.nodes) && !isNull(category.children.nodes)) {
                                return (
                                    <li className={cx('nav__cat', { 'nav__cat--active' : state === category.databaseId})} key={category.databaseId} onClick={() => setNavState(category.databaseId)}>
                                        {category.name}
                                        { !isNull(category.children.nodes) && !isEmpty(category.children.nodes) && <i></i> }
                                        <SubNav {...{items: category.children.nodes, show: !media, state: state, id: category.databaseId, shrink : false, parent : category.slug }} />
                                    </li>
                                )
                            } else {
                                let q = {};
    
                                if(isUndefined(uparams[category.slug])) {
                                    q[category.slug] = 'all';
                                } else {
                                    if(uparams[category.slug] === 'all') {
                                        delete q[category.slug];
                                    } else {
                                        q[category.slug] = 'all';
                                    }
                                }

                                if(!isEmpty(uparams, true)) {
                                    const query = Object.assign({}, uparams);
                                    if(!isUndefined(query[category.slug])) {
                                        delete query[category.slug];
                                    }
                                    q = {...q, ...query};
                                }

                                return (
                                    <li className="nav__cat" key={category.databaseId}>
                                        <Link href={{
                                            pathname: '/prodotti',
                                            query: q,
                                        }} >
                                            <a dangerouslySetInnerHTML={{__html: category.name}}></a>
                                        </Link>
                                    </li>
                                )
                            }
                        })
                    }
                    </ul>
                <Search searchQuery={ searchQuery } setSearchQuery={ setSearchQuery } handleSearchFormSubmit={handleSearchFormSubmit} />
                <OrderMenu />
            </nav>
            {
                categories.map((category) => (
                    <SubNav {...{items: category.children.nodes, show: media, state: state, id: category.databaseId, shrink : true, parent : category.slug }} key={category.databaseId} />
                ))
            }
        </div>
    )
}
