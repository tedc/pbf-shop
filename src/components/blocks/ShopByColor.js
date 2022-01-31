import { isEmpty } from 'lodash';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import cx from 'classnames';
import Image from "../../image";
import useSwiperRef from '../commons/useSwiperRef';
import Arrow from '../commons/Arrow';
import { Instagram, Basket } from '../icons';
import ProductPreview from '../product/ProductPreview';
import { CSSTransition } from 'react-transition-group';

export default function ShopByColor(props) {
    const {
        title,
        shopByColor,
        instagram
    } = props;
    
    if( isEmpty(shopByColor)) {
        return '';
    }
    const [ current, setCurrent ] = useState( null );
    const [ nextEl, nextElRef ] = useSwiperRef();
    const [ prevEl, prevElRef ] = useSwiperRef();
    const openProduct = (id)=> {
        setCurrent( id );
    }
    return (
         <div className="row row--shopbycolor row--grow-140-bottom">
            <header className="header header--shrink header--grow-80-bottom">
                <h2 className={cx('title', 'title--grow-40-bottom', 'title--font-size-38')} dangerouslySetInnerHTML={ { __html: title ? title : 'Shop by color'} }></h2>
                <a href={`https://instagram.com/${instagram}`} className="button button--social">
                    <Instagram />@{instagram}
                </a>
            </header>
            <Swiper
                modules={[Navigation]}
                slidesPerView={'auto'}
                loop={ true }
                speed={1000}
                centeredSlides={true}
                pagination={{
                    clickable : true,
                    type: 'bullets',
                    renderBullet: (index, className)=> {
                        return `<span class=${className}>${index + 1}</span>`;
                    }
                }}
                //virtual
                navigation={{
                    prevEl,
                    nextEl
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevElRef.current;
                    swiper.params.navigation.nextEl = nextElRef.current;
                }}
            >
                {shopByColor.map((item, index)=> (
                    <SwiperSlide key={`${item.product.productId}-${index}`}>
                        <div className="shopbycolor">
                            <figure className="shopbycolor__figure">
                                <Image
                                    width={item?.image?.mediaDetails?.width}
                                    height={item?.image?.mediaDetails?.height}
                                    loading="lazy"
                                    sourceUrl={ item?.image?.sourceUrl ?? '' }
                                    altText={ item?.image?.altText ?? item.product.name}
                                    objectFit="cover"
                                    layout='fill'
                                />
                            </figure>
                            <div className="shopbycolor__icon" onClick={()=> openProduct( item.product.productId )}><Basket /></div>
                            <CSSTransition in={ current === item.product.productId } timeout={300} classNames="shopbycolor__product" unmountOnExit>
                                <div className="shopbycolor__product">
                                    <div className="shopbycolor__close" onClick={()=>setCurrent(null)}></div>
                                    <ProductPreview product={item.product}  />
                                </div>
                            </CSSTransition>
                        </div>
                    </SwiperSlide>
                ))}
                <nav className="nav nav--shrink nav--grow-40-top"> 
                    <div className="swiper-button-prev" ref={prevElRef}>
                        <Arrow side="left" />
                    </div>
                    <div className="swiper-button-next" ref={nextElRef}>
                        <Arrow side="right" />
                    </div>
                </nav>
            </Swiper>
         </div>
    )
} 