import { isEmpty, isNull } from 'lodash';
import Button from '../commons/Button';
import Title from '../commons/Title';
import ProductItem from '../product/ProductItem';
import Image from "../../image";
import cx from 'classnames';
import { useState, useRef, useEffect, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useLazyQuery } from '@apollo/client';
import {  GET_PRODUCTS } from '../../queries/products/get-products';
import { gsap } from 'gsap/dist/gsap';
import { Navigation, Parallax } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import useSwiperRef from '../commons/useSwiperRef';
import Arrow from '../commons/Arrow';

export default function Quiz(props) {
    const slides = props.slides;
    const [ slide, setSlide] = useState( 0 );
    const [ choices, setChoices] = useState( slides[0]?.cat?.children?.nodes );
    const [ products, setProducts ] = useState([]);
    const [ title, setTitle ] = useState( props.introTitle );
    const [ buttonText, setButtonText ] = useState( 'Avanti' );
    const where = {
        typeIn: [
            'SIMPLE',
            'VARIABLE'
        ],
        orderby: [{
            field : 'RAND',
        }],
        offsetPagination : {
            size: 12,
            offset: 0,
        },
        categoryIdIn: [],
    }
    const objids = {};
    slides.map((slide)=> {
        objids[slide.cat.databaseId] = [];
    })

    const [ ids, setIds ] = useState( objids );
    const [ query, setQuery ] = useState( where );

    const quiz = useRef();
    const swiperRef = useRef();
    const titleRef= useRef();
    const [ nextEl, nextElRef ] = useSwiperRef();
    const [ prevEl, prevElRef ] = useSwiperRef();

    function useStateRef(processNode) {
        const [node, setNode] = useState(null);
        const setRef = useCallback(newNode => {
            setNode(processNode(newNode));
        }, [processNode]);
        return [node, setRef];
    }

    const [ fetchPosts, { loading } ] = useLazyQuery( GET_PRODUCTS, {
        notifyOnNetworkStatusChange: true,
        onCompleted: ( data ) => {
            setTitle( 'Ecco cosa abbiamo trovato per te' );
            setProducts( data?.products?.edges ?? {} );
            gsap.to(titleRef.current, {
                autoAlpha: 1,
                duration: 1
            })
        },
    } );

    const changeSlide = ()=> {
        if( isEmpty ( ids[ slides[slide]?.cat?.databaseId ] ) ) {
            return;
        }

        const timeline = gsap.timeline({
            defaults: {
                duration: 1
            }
        })
        if( slide + 1 < slides.length ) {
            timeline
                .to(quiz.current, {
                    autoAlpha: 0,
                    onComplete: ()=> {
                        setSlide( slide + 1)
                        setChoices( slides[slide + 1]?.cat?.children?.nodes );
                        if( slide + 1 === slides.length - 1) {
                            setButtonText( 'Cerca' );
                        }
                    }
                })
                .to(quiz.current, {
                    autoAlpha: 1
                })
        } else {
            gsap.to([quiz.current, titleRef.current], {
                autoAlpha: 0,
                duration: 1,
                onComplete: ()=> {
                    console.log( where );
                    fetchPosts({
                        variables: {
                            query : query
                        },
                    })
                }
            })
            
        }
    }

    const selectCat = (term)=> {
        const id = term.databaseId;
        const parent = term.parentDatabaseId;
        //const where = query;
        
        const oldIds = Object.assign({}, ids);
        const idx = oldIds[ parent ].indexOf(id);
        if(idx === -1) {
            oldIds[ parent ].push( id );
        } else {
            oldIds[ parent ].splice( idx, 1);
        }
        setIds( oldIds );

        Object.keys(ids).map( (key) => {
            if( !isEmpty( ids[key] ) ) {
                ids[key].map( (i) => {
                     where.categoryIdIn.push( parseInt( i ) );
                });
            }  
        });

        setQuery( where );
    }

    const reset = ()=> {
        setProducts([]);
        
        const oldIds = Object.assign({}, ids);
        for(const key in ids) {
            oldIds[key] = [];
        }
        setIds( oldIds );
        setSlide(0);
        setChoices( slides[ 0 ]?.cat?.children?.nodes );
        setButtonText( 'Avanti' );
        gsap.fromTo(quiz.current, {
            autoAlpha: 0
        },{
            autoAlpha: 1,
            duration: 1,
        });
        // swiperRef.current.swiper.slideToLoop(0);
        // swiperRef.current.swiper.update();
    }

    return (
        <>
            <div className='columns columns--quiz columns--jcc columns--aligncenter columns--shrink columns--grow-80' id="quiz">
                <div className="column colum--s10-md column--s7-lg">
                    <Title title={{
                        content : title,
                        type: 'h2',
                        size: cx('title--normal title--grow-40-bottom title--font-family-secondary', { 'title--font-size-14'  : isEmpty(products) }, { 'title--font-size-24' : !isEmpty(products)})
                    }} forwardRef={titleRef}/>
                    <CSSTransition in={ !isEmpty(products) } timeout={300} classNames="button-anim" unmountOnExit>
                        <div className="button button--rounded button--bg-black" onClick={()=> reset()}>
                            Ricomincia
                        </div>
                    </CSSTransition>
                    <div className={cx('quiz', {'quiz--hidden': !isEmpty(products) })} ref={quiz}>
                        <Title title={{
                            content : slides[slide].question,
                            type: 'h2',
                            size: 'title--grow-40-bottom title--font-size-38'
                        }} />
                        <Swiper
                            modules={[Navigation, Parallax]}
                            centeredSlides={true}
                            slidesPerView={1.5}
                            spaceBetween={15}
                            breakpoints={{
                                '768' : {
                                    slidesPerView: 3,
                                    spaceBetween: 30
                                }
                            }}
                            loop={ true }
                            loopedSlides={3}
                            speed={1000}
                            parallax
                            //virtual
                            navigation={{
                                prevEl,
                                nextEl
                            }}
                            onBeforeInit={(swiper) => {
                                swiper.params.navigation.prevEl = prevElRef.current;
                                swiper.params.navigation.nextEl = nextElRef.current;
                            }}
                            onUpdate={(swiper) => {
                                //swiper.virtual.update( true )
                            }}
                            ref={ swiperRef }
                        >
                        {choices.map((cat, index)=> (
                            <SwiperSlide key={cat.databaseId}>
                                <div className={ cx('quiz__item', { 'quiz__item--selected' : ids[ cat.parentDatabaseId ].indexOf(cat.databaseId) !== -1 } )} onClick={() => selectCat(cat)}>
                                    <figure className="quiz__figure" data-swiper-parallax-scale="0.8">
                                        <Image
                                            width={cat?.categoryDetails?.thumb?.mediaDetails?.width}
                                            height={cat?.categoryDetails?.thumb?.mediaDetails?.height}
                                            loading="lazy"
                                            sourceUrl={ cat?.categoryDetails?.thumb?.sourceUrl ?? '' }
                                            altText={ cat?.categoryDetails?.thumb?.altText ?? cat.name}
                                            objectFit="cover"
                                            layout='fill'
                                        />
                                    </figure>
                                    <h3 className="title title--font-size-14 title--upper"  data-swiper-parallax-opacity="0" dangerouslySetInnerHTML={ { __html: cat.name } }></h3>
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
                        <div className={ cx('button', 'button--rounded', 'button--bg-black', { 'button--disabled' : isEmpty( ids[ slides[slide]?.cat?.databaseId ] )} )} onClick={() => changeSlide() }>
                            { buttonText }
                        </div>
                    </div>
                </div>
            </div>
            <CSSTransition in={ !isEmpty(products) } timeout={300} classNames="columns--quiz" unmountOnExit>
                <div className="columns columns--archive">
                    { products.map((product, index)=> (
                        <div className="column column--s6-sm column--s4-md column--s3-lg"  key={product.node.databaseId}>
                            <ProductItem product={product.node} /> 
                        </div>
                    ))}
                </div>
            </CSSTransition>
            { props.title && props.content && <div className='columns columns--quiz columns--jcc columns--aligncenter columns--shrink columns--grow-80'>
                <div className="column colum--s12-md column--s8-lg">
                <Title title={{
                    content : props.title,
                    type: 'h2',
                    size: 'title--grow-40-bottom title--font-size-24'
                }} />
                <div className="content" dangerouslySetInnerHTML={{__html: props.content}}></div>
                </div>
            </div>}
        </>
    )
}