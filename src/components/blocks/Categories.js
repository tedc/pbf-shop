import { Navigation, Parallax} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from "../../image";
import Title from '../commons/Title';
import Button from '../commons/Button';
import Arrow from '../commons/Arrow';
import useSwiperRef from '../commons/useSwiperRef';
import {useRef, useEffect} from 'react';
export default function Categories(props) {
    const cats = props?.children?.nodes || []; 
    const [nextEl, nextElRef] = useSwiperRef();
    const [prevEl, prevElRef] = useSwiperRef();
    const swiperRef = useRef();
    return (
        <div className="row row--categories row--grow-140-bottom">
            <Swiper
                slidesPerView={1.3}
                modules={[Navigation,Parallax]}
                centeredSlides
                spaceBetween={30}
                loop
                parallax
                speed={1500}
                breakpoints={{
                    768: {
                        slidesPerView:1.5
                    }
                }}
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
            {cats.map((cat) => (
                <SwiperSlide key={cat.databaseId}>
                    <div className="item item--category">
                        <Image
                            width={cat.image?.mediaDetails?.width}
                            height={cat.image?.mediaDetails?.height}
                            loading="lazy"
                            sourceUrl={ cat.image?.sourceUrl ?? '' }
                            altText={cat.image?.altText ?? product.name}
                            objectFit="cover"
                            layout='fill'
                        />
                        <div className="item__content" data-swiper-parallax-y="-20%" data-swiper-parallax-opacity="0">
                            <Title title={{content: props.name, size: 'title--font-family-secondary title--font-size-12', type: 'h2'}}/>
                            <Title title={{content: cat.name, size: 'title--grow-40 title--font-size-80', type: 'h2'}}/>
                            <Button btn={{
                                link: {
                                  url: `/prodotti/?category=${cat.slug}`,
                                  title: 'Scopri i prodotti'  
                                },
                                color: 'white',
                            }} />
                        </div>
                    </div>
                </SwiperSlide>
            ))}
            <div className="swiper-button-prev" ref={prevElRef}>
                <Arrow side="left" />
            </div>
            <div className="swiper-button-next" ref={nextElRef}>
                <Arrow side="right" />
            </div>
            </Swiper>
        </div>
    )
}