import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap/dist/gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export const AppContext = React.createContext([
	{},
	() => {}
]);

export const AppProvider = ( props ) => {

    gsap.registerPlugin(ScrollTrigger);
	const [ cart, setCart ] = useState( null );
    const [ miniCart, setMiniCart ] = useState( null );
    const [ showInCart, setShowInCart ] = useState( false );
    const [ cartLoading, setCartLoading ] = useState( false );
    const [ showLogin, setShowLogin ] = useState(false);
    const [ session, setSession ] = useState( null );
    const [ isMenuVisible, setMenuVisibility ] = useState(false);
    const getVh = ()=> {
        const ratio = window.innerWidth / 1366;
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    const titleSize = ()=> {
        const ratio = window.innerWidth / 1366;
        const sizes = [
            50,
            70,
            80,
            90,
            100
        ];
        for(const s in sizes) {
            const size = sizes[s];
            document.documentElement.style.setProperty('--fz-'+size, `${(size * ratio)}px`);
        }
    }
	useEffect( () => {

		// @TODO Will add option to show the cart with localStorage later.
		if ( process.browser ) {

			let cartData = localStorage.getItem( 'woo-next-cart' );
			cartData = null !== cartData ? JSON.parse( cartData ) : '';
			setCart( cartData );

		}
        titleSize();
        getVh();
        window.addEventListener('resize', ()=> {
            titleSize();
            getVh();
        });
        document.addEventListener('keydown', (e)=> {
            if(e.keyCode == 27) {
                setShowInCart(false);
            }
        })

	}, [] );

	return (
		<AppContext.Provider value={ { miniCart, setMiniCart, cart, setCart, showInCart, setShowInCart, showLogin, setShowLogin, session, setSession, cartLoading, setCartLoading, isMenuVisible, setMenuVisibility } }>
			{ props.children }
		</AppContext.Provider>
	);
};
