import { isEmpty } from 'lodash';
import { Navigation, Pagination, Parallax, EffectFade } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRef } from 'react';
import cx from 'classnames';
import Image from "../../image";
import useSwiperRef from '../commons/useSwiperRef';
import Arrow from '../commons/Arrow';

export default function News(props) {
    const { news } = props;
    if(isEmpty(news)) {
        return '';
    }
    const [ nextEl, nextElRef ] = useSwiperRef();
    const [ prevEl, prevElRef ] = useSwiperRef();
    const swiperRef = useRef();
    const paddingTop = (picture)=> {
        const width = picture?.mediaDetails?.width;
        const height = picture?.mediaDetails?.height;
        return `${ ( height / width ) * 100 }%`;
    }
    return (
        <div className="row row--news row--grow-140-bottom">
            <Swiper
                modules={[Navigation, Parallax, Pagination, EffectFade]}
                slidesPerView={1}
                loop={ true }
                speed={1000}
                parallax
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
                effect="fade"
                fadeEffect={{
                    crossFade: true
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevElRef.current;
                    swiper.params.navigation.nextEl = nextElRef.current;
                }}
                ref={ swiperRef }
            >
            {news.map((item, index)=> (
                <SwiperSlide key={`${item.title}-${index}`}>
                    <div className="columns">
                        <figure className="column column--s6 column--figure column--figure-news column--relative" data-swiper-parallax-y="-50%" style={{ '--padding-top': paddingTop( item?.picture )}}>
                            <Image
                                width={item?.picture?.mediaDetails?.width}
                                height={item?.picture?.mediaDetails?.height}
                                loading="lazy"
                                sourceUrl={ item?.picture?.sourceUrl ?? '' }
                                altText={ item?.picture?.altText ?? item.title}
                                objectFit="cover"
                                layout='fill'
                            />
                        </figure>
                        <div className="column column--s6 column--figure column--figure-news column--content column--content-news">
                            {item.category && <h4 className="title title--grow-40-bottom title--font-size-14 title--font-family-secondary title--normal" dangerouslySetInnerHTML={{__html:item.category}}></h4> }
                            {item.title && <h3 className="title title--grow-40-bottom title--font-size-38" dangerouslySetInnerHTML={{__html:item.title}}></h3> }
                            {item.content && <div className="content"  dangerouslySetInnerHTML={{__html:item.content}}></div> }
                            {item.button && <a href={item.button.link} target="_blank" className="button button--rounded button--bg-black">{item.button.title ? item.button.title : 'Leggi di più' }</a> }
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