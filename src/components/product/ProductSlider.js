import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductItem from '../product/ProductItem';
import Arrow from '../commons/Arrow';
import useSwiperRef from '../commons/useSwiperRef';
import {useRef, useEffect} from 'react';

export default function ProdctSlider({products, slides, blockId}) {
    const slidesPerView = slides === 1 ?  'auto' : 3;
    const breakpoints = {
        768 : {
            slidesPerView: slidesPerView,
        }
    }
    const loop = slides === 1 || products.length < 3 ? false : true;
    const [nextEl, nextElRef] = useSwiperRef();
    const [prevEl, prevElRef] = useSwiperRef();
    const swiperRef = useRef();
    return (
        <>
        <Swiper
            slidesPerView={'auto'}
            loop={loop}
            speed={1000}
            modules={[Navigation]}
            navigation={{
                prevEl,
                nextEl
            }}
            onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevElRef.current;
                  swiper.params.navigation.nextEl = nextElRef.current;
             }}
            ref={swiperRef}
        >
        {products.map((product, index)=> {
            return (
                <SwiperSlide key={`${product?.node?.databaseId}-${index}-${blockId}-${({ isDuplicate }) => isDuplicate ? 'duplicate' : ''}`}>
                    <ProductItem product={product.node} /> 
                </SwiperSlide>
            )})}
        </Swiper>
        <nav className="nav nav--shrink nav--shrink-right-md">
            <div className="swiper-button-prev" ref={prevElRef}>
                <Arrow side="left" />
            </div>
            <div className="swiper-button-next" ref={nextElRef}>
                <Arrow side="right" />
            </div>
        </nav>
        </>
    )
}