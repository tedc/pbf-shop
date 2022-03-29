import Link from 'next/link';
import CartIcon from "./cart/CartIcon";
import CartIconLocal from "./cart/CartIconLocal";
import { useRouter } from 'next/router';
import { Logo, Account } from './icons'
import { useState, useRef, useEffect, useContext } from 'react';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import cx from 'classnames';
import { isEmpty, isNull, isUndefined } from 'lodash';
import { CSSTransition } from 'react-transition-group';
import Image from '../image';
import Login from './commons/Login';
import { useSession } from "next-auth/react";
import { AppContext } from "./context/AppContext";
import { SpinnerDotted } from 'spinners-react'; 

const ProductsMenu = ({categories})=> {
    return (
        <div className="banner__menu">
            <>
            {
                categories.map((cat)=> {
                    const children = cat?.children?.nodes;
                    const picture = cat?.image;
                    if( !isEmpty( children ) ) {
                        return (
                            <div className="banner__categories" key={cat.databaseId}>
                                <h3 className="title title--normal title--font-family-secondary title--font-size-18">
                                    <Link href={{
                                        pathname: '/prodotti',
                                        query: {
                                            [cat.slug] : 'all'
                                        },
                                    }}>
                                        <a>{cat.name}</a>
                                    </Link>
                                </h3>
                                <ul>
                                {
                                    children.map((child, index)=> (
                                        <li key={`${child.databaseId}-${index}`}>
                                            <Link href={{
                                                pathname: '/prodotti',
                                                query: {
                                                    [cat.slug] : child.slug
                                                },
                                            }}>
                                                <a>{child.name}</a>
                                            </Link>
                                        </li>
                                    ))
                                }
                                </ul>
                            </div>
                        )
                    } else {
                        return (
                            <div className="banner__categories" key={cat.databaseId}>
                                <h3 className="title title--normal title--font-family-secondary title--font-size-18">
                                    <Link href={{
                                        pathname: '/prodotti',
                                        query: {
                                            [cat.slug] : 'all'
                                        },
                                    }}>
                                        <a>
                                            { picture && <Image
                                                width={picture?.mediaDetails?.width}
                                                height={picture?.mediaDetails?.height}
                                                loading="lazy"
                                                sourceUrl={ picture?.sourceUrl ?? '' }
                                                altText={picture?.altText ?? ''}
                                            /> }
                                            {cat.name}
                                        </a>
                                    </Link>
                                </h3>
                            </div>
                        )
                    }
                })
            }
            </>
        </div>
    )
}

const Nav = (props) => {
    if(!isUndefined(props.isCheckout)) {
        if(props.isCheckout ) return '';
    }
    const menus = props?.menus?.edges;
    if(isUndefined(menus) || isEmpty(menus)) {
        return '';
    }
    let menu; 
    menus.map((item)=> {
        const node = item.node;
        if(node?.locations?.indexOf('PRIMARY_NAVIGATION') !== -1) {
            menu = node;
        }
    })
    gsap.registerPlugin(ScrollTrigger);
    const { showLogin, setShowLogin, session, setSession, isMenuVisible, setMenuVisibility } = useContext( AppContext );
    const [ isBannerActive, setIsBannerActive ] = useState(false);
    const [ banner, setBanner ] = useState( false);
    const [ isBannerMenuVisible, setIsBannerMenuVisible] = useState(false);
    const { data : currentSession, status } = useSession();

    const menuItems = menu?.menuItems?.nodes ?? [];
    const navRef = useRef();
    const router = useRouter();
    const [ loggedIn, setLoggedIn ] = useState( false )
    const options = {...props?.options};

    const openLogin = (event, path)=> {
        event.preventDefault();
        if(!loggedIn) {
            setShowLogin( !showLogin );
        } else {
            router.push(path);
        }
    }   
    const showMenu = (path, cond)=>{
        if( path.indexOf('prodotti') !== -1) {
            setIsBannerMenuVisible( cond );
        }
    }

    useEffect(()=> {
        setBanner( !isNull(document.querySelector('.hero img')) && !isEmpty(document.querySelector('.hero img')) && !isUndefined(document.querySelector('.hero img')) );
        const scrollTrigger = ScrollTrigger.create({
            start: 40,
            trigger: document.body,
            onEnter: ()=> {
                setIsBannerActive(true);
            },
            onLeaveBack: ()=> {
                setIsBannerActive(false);
            },
        });
        setSession( currentSession );
        router.events.on('routeChangeStart', () => setIsBannerMenuVisible(false));
        return ()=> {
            if( !isNull( scrollTrigger ) ) scrollTrigger.kill()
        }
    }, [ currentSession ]);

	return (
        <>
		<nav className={cx('banner','banner--shrink', {'banner--inview' : isBannerActive, 'banner--clear': banner, 'banner--open' : isMenuVisible }, {'banner--menu-visible' : isBannerMenuVisible })} ref={navRef}>
			<Link href="/">
                <a className="brand">
                    <Logo />
                </a>
            </Link>
            <div className="banner__container">
                <>
                { !isEmpty(menuItems) ? (
                    <ul className="banner__list">
                        {
                            menuItems.map((menuItem, index)=> (
                                <li key={`${menuItem.id}-${index}`} onMouseEnter={()=>showMenu(menuItem.path, true)} onMouseLeave={()=>showMenu(menuItem.path, false)} className={cx('banner__item', { 'banner__item--active': router.pathname.indexOf(menuItem.path) !== -1}, { 'banner__item--archive': menuItem.path.indexOf('prodotti') !== -1})}>
                                    {
                                        menuItem.url.indexOf(process.env.NEXT_PUBLIC_WORDPRESS_URL) !== -1 ? (
                                            <Link href={menuItem.path}>
                                                <a className="banner__link" dangerouslySetInnerHTML={{__html : menuItem.label}}></a>
                                            </Link>

                                        ) : (
                                            <a href={ menuItem.url } className="banner__link" dangerouslySetInnerHTML={ { __html: menuItem.label }} target="_blank"></a>
                                        )
                                    }
                                    { ( menuItem.path.indexOf('prodotti') !== -1) && <ProductsMenu categories={props.categories} /> }
                                </li>
                            ))
                        }
                    </ul>
                ) : ''}
                </>
                <div className="banner__tools">
                    <CartIconLocal/>
                    <div className={cx('banner__account')}>
                    <CSSTransition in={ status === 'unauthenticated' } timeout={500} classNames="account-loading" unmountOnExit>
                        <a href="#" onClick={(event)=> openLogin(event, '/area-clienti')} className="button button--rounded button--bg-black">
                            Area clienti
                        </a>
                    </CSSTransition>
                    <CSSTransition in={ status === 'authenticated' } timeout={500} classNames="account-loading" unmountOnExit>
                        <Link href="/area-clienti">
                            <a>
                                <Account width={15} height={15} />
                                { session?.user?.customer?.displayName ? session?.user?.customer?.displayName : session?.user?.nicename }
                            </a>
                        </Link>
                    </CSSTransition>
                    <CSSTransition in={ status === 'loading' } timeout={500} classNames="account-loading" unmountOnExit>
                        <SpinnerDotted  style={{ color: 'black', position: 'absolute', top: '50%', left: '50%', width: 24, height: 24, margin: -12}} /> 
                    </CSSTransition>
                    </div> 
                </div>
            </div>
            <div className="banner__toggle" onClick={()=> setMenuVisibility(!isMenuVisible) }>Menu<i></i></div>
		</nav>
        <CSSTransition in={showLogin} timeout={300} classNames="form--login" unmountOnExit>
            <Login {...options} />
        </CSSTransition>
        <style jsx>{
            `
            .account-loading-enter {
                opacity: 0;
            }
            .account-loading-enter-active {
                opacity: 1;
                transition: opacity .5s;
            }
            .account-loading-exit {
                opacity: 1;
            }
            .account-loading-exit-active {
                opacity: 0;
                transition: opacity .5s;
            }
            `
        }
        </style>
        </>
	)
};

export default Nav;
