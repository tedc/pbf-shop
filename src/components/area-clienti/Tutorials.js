import { useQuery } from '@apollo/client';
import { GET_TUTORIALS } from '../../queries/users/get-tutorials';
import { useState, useEffect } from 'react';
import { SpinnerDotted } from 'spinners-react'; 
import { CSSTransition } from 'react-transition-group';
import { isEmpty } from 'lodash';
import Link from 'next/link';

export default function Tutorials(props) {
    const [ tutorials, setTutorials ] = useState([]);
    const [ wpQuery, setWpQuery ] = useState({});
    const [ pageNo, setPageNo ] = useState(1);

    const { refetch, loading, data, error } = useQuery(GET_TUTORIALS, {
        variables: {
            where: wpQuery
        },
        onCompleted: ()=> {
            setTutorials( data?.tutorials?.nodes );
        }
    });

    useEffect(()=> {
        if( ! isEmpty(wpQuery, true) ) {
            refetch({
                variables: {
                    where: wpQuery
                }
            })
        }
    }, [wpQuery] );

    return (
        <>
        <h2 className="title title--grow-40-bottom title--font-size-24">Corsi e tutorial</h2>
        <div className="columns columns--gutters">
            { ! isEmpty( tutorials ) ? (
                <>
                {
                    tutorials.map( (item, index)=> {
                        const { seminarInfo } = item;
                        const {
                            seminarDate,
                            webinarDate
                        } = seminarInfo;
                        return (
                            <Link href={{ 
                                pathname: '/area-clienti/corsi-tutorial/[id]',
                                query: {id: item?.tutorialId}
                            }} key={`${item?.tutorialId}-${index}`}>
                            <a className="column column--tutorial column--grow-30-bottom column--s4-md column--s6-xs">
                                <figure className="figure">
                                    <img src={item?.featuredImage?.node?.sourceUrl} style={{width: '100%', height: 'auto', opacity: 1}} />
                                    <button className="button button--rounded">Leggi tutto</button>
                                </figure>
                                <time className="date">
                                    { webinarDate ? webinarDate : seminarDate }
                                </time>
                                <h3 className="title title--font-size-16" dangerouslySetInnerHTML={{__html: item?.title }}></h3>
                            </a>
                            </Link>
                        )
                    })
                }
                <style jsx>{
                    `
                    .column--tutorial .date {
                        display: block;
                        font-weight: normal;
                        font-family: 'OGPBF', 'Times New Roman', Times, Georgia, serif;
                        font-size: 12px;
                        margin-bottom: 15px;
                    }
                    .column--tutorial .figure {
                        position: relative;
                        line-height: 0;
                        margin-bottom: 20px;
                    }
                    .column--tutorial .figure:before {
                        position: absolute;
                        content: '';
                        background: black;
                        opacity: 0;
                        transition: opacity .5s;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }
                    .column--tutorial .button {
                        color: white;
                        border: 1px solid white;
                        position: absolute;
                        white-space: nowrap;
                        top: 50%;
                        left: 50%;
                        transform: translate3d(-50%, -40%, 0);
                        opacity: 0;
                        transition: background-color .5s, transform .5s, opacity .5s;
                    }
                    .column--tutorial .button:hover {
                        background-color: white;
                        color: black;
                    }
                    .column--tutorial:hover {
                        opacity: 1;
                    }
                    .column--tutorial:hover .figure::before {
                        opacity: .6;
                    }
                    .column--tutorial:hover .button {
                        transform: translate3d(-50%, -50%, 0);
                        opacity: 1;
                    }
                    `
                }</style>
                </>
            ) : ('')}
        </div>
        {loading && <SpinnerDotted style={{ color: 'black', position: 'fixed', top: '50%', left: '50%', margin: '-25px 0 0 -25px'}} />}
        </>
    )
}