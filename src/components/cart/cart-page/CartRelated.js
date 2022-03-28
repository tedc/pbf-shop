import { isEmpty } from 'lodash';
import { Navigation, Virtual} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductItem from '../../product/ProductItem';
import Arrow from '../../commons/Arrow';
import useSwiperRef from '../../commons/useSwiperRef';
import { GET_PRODUCTS } from '../../../queries/products/get-products';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useState, useRef, useEffect, useCallback } from 'react';
import cx from 'classnames';

export default function CartRelated(props) {
    const { categories, kits } = props;
    const [ related, setRelated ] = useState( [] );
    const [ tab, setTab ] = useState( 'categories' );
    const [ nextEl, nextElRef ] = useSwiperRef();
    const [ prevEl, prevElRef ] = useSwiperRef();
    const [ prev, setPrev ] = useState(  );
    const [ next, setNext ] = useState(  );

    const prevdRef = useCallback(node => {
        if (node !== null) {
            setPrev(node);
        }
    }, []);

    const nextRef = useCallback(node => {
        if (node !== null) {
            setNext(node);
        }
    }, []);

    const swiperRef = useRef();
    const ids = {
        categories: categories,
        kits: kits
    }

    const where = {
        typeIn: [
            'SIMPLE',
            'VARIABLE'
        ],
        offsetPagination: {
            size: 8,
            offset: 0,
        },
        taxonomyFilter: {
            filters: [],
            relation : 'AND',
        }
    }

    where.taxonomyFilter.filters.push({
        taxonomy: 'PRODUCTCATEGORY',
        ids: ids[tab],
    });
    
    const { refetch, loading, error, data } = useQuery( GET_PRODUCTS, {
        variables: {
            query: where,
        },
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            setRelated( data?.products?.edges );
        }
    });
    const slides = 2;
    const slidesPerView = related.length === 1 ?  'auto' : 4;
    const breakpoints = {
        768 : {
            slidesPerView: slidesPerView,
        }
    }
    const loop = related.length === 1 || related.length < 3 ? false : true;

    useEffect( ()=> {
        refetch();
    }, [ tab ] );

    return (
        <div className="cart__related">
            { !isEmpty(related) && <div className="columns columns--jcc columns--shrink columns--grow-40-bottom">
                <div className="column column--nav column--s10-lg">
                { !isEmpty( categories ) && ( <button className={cx('button', 'button--rounded', { 'button--bg-black' : tab === 'categories'})} onClick={(event)=> setTab('categories')}>Suggeriti</button> ) }
                { !isEmpty( kits ) && ( <button className={cx('button', 'button--rounded', { 'button--bg-black' : tab === 'kits'})} onClick={(event)=> setTab('kits')}>Kit di lavorazione</button> ) }
                </div>
            </div> }
            <Swiper
                slidesPerView={slides}
                breakpoints={breakpoints}
                loop={loop}
                speed={1000}
                modules={[Navigation, Virtual]}
                navigation={{
                    nextEl,
                    prevEl
                }}
               // virtual
                onInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevElRef.current;
                    swiper.params.navigation.nextEl = nextElRef.current;
                }}
                onUpdate={(swiper) => {
                    //swiper.virtual.update( true );
                    // swiper.params.navigation.prevEl = prev;
                    // swiper.params.navigation.nextEl = next;
                    //swiper.navigation.init()    
                    if(!swiper.isLocked ) {
                        swiper.navigation.prevEl.classList.remove('swiper-button-lock');
                        swiper.navigation.nextEl.classList.remove('swiper-button-lock');
                    }
                }}
                ref={swiperRef}
            >
            {related.map((product, index)=> (
                <SwiperSlide key={product.node.databaseId} virtualIndex={index}>
                    <ProductItem product={product.node} /> 
                </SwiperSlide>
            ))}
            </Swiper>
            <div className="columns columns--jcc columns--shrink columns--grow-140-bottom">
                <nav className="column--nav column--nav-arrows column column--s10-lg">
                    <div className="swiper-button-prev" ref={prevElRef}>
                        <Arrow side="left" />
                    </div>
                    <div className="swiper-button-next" ref={nextElRef}>
                        <Arrow side="right" />
                    </div>
                </nav>
            </div>
        </div>
    )
}