import { useQuery } from '@apollo/client';
import { LAST_BANNER } from '../queries/get-options';
import { isNull, isEmpty } from 'lodash';
import { useState, useEffect } from 'react';
import cx from 'classnames';
import cookie from 'cookie-cutter';
import { CSSTransition } from 'react-transition-group';

export default function Banner() {
    const [ isBannerVisible, setIsBannerVisible ] = useState(false);
    //const [ isBannerClose, setIsBannerClose ] = useState(true);
    const [ banner, setBanner ] = useState( null );
    const { loading, data } = useQuery(LAST_BANNER, {
        notifyOnNetworkStatusChange: true,
        onCompleted: (data)=> {
            setBanner(data?.banners?.nodes[0]);
        }
    });
    const closeBanner = ()=> {
        const date = new Date();
        const tomorrow = date.getTime() + (24 * 60 * 60 * 1000);
        cookie.set('banner-close',1, { exipres : tomorrow });
        setIsBannerVisible(false);
    }
    useEffect(()=> {    
        const events = [
            'touchstart',
            'click',
            'scroll',
            'mouseenter',
            'mousemove'
        ];
        
        events.map((event)=> {
            window.addEventListener(event, ()=> {const getCookie = cookie.get('banner-close'); if( !isBannerVisible && !getCookie ) {setIsBannerVisible(true)}})
        });
        return ()=> {
            setIsBannerVisible( false );
            setBanner( null );
        }
    }, [ ])
    return (
        <>
        <CSSTransition in={ isBannerVisible } timeout={500} classNames="announcement" unmountOnExit>
            <div className={cx('announcement', {'announcement--bg-black' : banner?.options?.background === 'black'}, {'announcement--bg-white' : banner?.options?.background === 'white'})}>
                <div className="announcement__close" onClick={closeBanner}></div>
                <div className="announcement__content" dangerouslySetInnerHTML={{__html:banner?.content}}></div>
            </div>
        </CSSTransition>
        <style jsx>{
                `
            .announcement {
                position: fixed;
                z-index: 9999;
                width: 100%;
                top: 0;
                left: 0;
                padding: 10px;
                text-transform: uppercase;
                text-align: center;
                font-size: 10px;
            }
            .announcement-enter {
                transform: translate3d(0, -100%, 0);
            }
            .announcement-enter-active {
                transform: translate3d(0, 0%, 0);
                transition: transform .5s;
            }
            .announcement-exit {
                 transform: translate3d(0, 0%, 0);
            }
            .announcement-exit-active {
                transform: translate3d(0, -100%, 0);
                transition: transform .5s;
            }
            .announcement--bg-black {
                color: white;
                background-color: black;
            }
            .announcement--bg-white {
                color: black;
                background-color: white;
            }
            .announcement__close {
                width: 16px;
                cursor: pointer;
                position: absolute;
                top: 50%;
                margin-top: -8px;
                right: 15px;
                height: 16px;
                transform: translateZ(0) rotate(45deg);
            }
            .announcement__close:before, .announcement__close:after {
                content: '';
                height: 2px;
                width: 100%;
                position: absolute;
                left: 0;
                top: 50%;
                margin-top: -1px;
            }
            .announcement__close:after {
                transform: translateZ(0) rotate(90deg);
            }
            .announcement--bg-black .announcement__close:after,
            .announcement--bg-black .announcement__close:before {
                background: white;
            }
            .announcement--bg-white .announcement__close:after,
            .announcement--bg-white .announcement__close:before {
                background: black;
            }
            `
        }</style>
        </>
    )
}