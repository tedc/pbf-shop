import cx from 'classnames';
import { useState } from 'react';
import { isNull, isEmpty } from 'lodash';
import { date } from '../../utils/user';
import Link from 'next/link';
import Arrow from '../commons/Arrow';

export default function Tutorial(props) {
    const {
        tutorial,
        session,
    } = props;
    const { seminarInfo } = tutorial;
    const keys = [
        {id: 'Date', label : 'Quando'},
        {id: 'Teachers', label : 'Docenti'},
        {id: 'Materials', label : 'Materiali di lavoro'},
        {id: 'Duration', label : 'Durata'},
        {id: 'Capacity', label : 'Partecipanti'},
        {id: 'Place', label : 'Luogo' }
    ];
    return (
        <>
            <Link href="/area-clienti/corsi-tutorial">
                <a className="back back--tutorial">
                    <Arrow side="left"/>
                    Torna ai corsi
                </a>
            </Link>
            <header className="header header--tutorial">
            <h1 className="title title--font-size-38" dangerouslySetInnerHTML={{__html: tutorial?.title }}></h1>
            <time className="date">
                { seminarInfo?.webinarDate ? seminarInfo?.webinarDate : seminarInfo?.seminarDate }
            </time>
            </header>
            <figure className="figure">
                <img src={tutorial?.featuredImage?.node?.sourceUrl} style={{width: '100%', height: 'auto', opacity: 1}} />
            </figure>
            <div className="columns columns--gutters">
                <div className="column column--grow-40 column--s6-sm">
                    <h1 className="title title--grow-30-bottom title--font-size-24">Webinar</h1>
                    {
                        keys.map((key, index) => (
                            <div className="info info--tutorial" key={`${key.id}-${index}`}>
                                { key.label }<strong>{seminarInfo[`webinar${key.id}`]}</strong>
                            </div>
                        ))
                    }
                </div>
                <div className="column column--grow-40 column--s6-sm">
                    <h1 className="title title--grow-30-bottom title--font-size-24">Seminar</h1>
                    {
                        keys.map((key, index) => (
                            <div className="info info--tutorial" key={`${key.id}-${index}`}>
                                { key.label }<strong>{seminarInfo[`seminar${key.id}`]}</strong>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="content content--tutorial" dangerouslySetInnerHTML={{ __html : tutorial?.content }}>
            </div>
            <style jsx global>{
                `
                .header--tutorial {
                    padding-bottom: 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .header--tutorial .date {
                    padding: 10px 0;
                    font-size: 13px;
                    font-family: 'OGPBF', 'Times New Roman', Times, Georgia, serif;
                }
                .back--tutorial {
                    margin-bottom: 20px;
                }
                .column .info--tutorial:nth-last-child(1) {
                    border-bottom: 1px solid black;
                }
                .info--tutorial {
                    font-size: 13px;
                    padding: 15px 0;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid black;
                }
                .content--tutorial h2,
                .content--tutorial h3, 
                .content--tutorial h4, 
                .content--tutorial h5  {
                    font-size: 24px;
                    margin-top: 40px;
                    font-weight: normal;
                }
                .content--tutorial > h2:nth-child(1),
                .content--tutorial > h3:nth-child(1), 
                .content--tutorial > h4:nth-child(1), 
                .content--tutorial > h5:nth-child(1) {
                    margin-top: 0;
                }
                .content--tutorial > p, 
                .content--tutorial > ul,
                .content--tutorial > ol {
                    padding-top: 30px;
                }
                .content--tutorial ul li,
                .content--tutorial ol li {
                    position: relative;
                    line-height: ${(22/14) * 100}%;
                    padding-left: 30px;
                }
                .content--tutorial ol {
                    counter-reset: section;
                }
                .content--tutorial ol li:before {
                    counter-increment: section;
                    content: counter(section) ".";
                    position: absolute;
                    left: 0;
                    font-weight: bold;
                    font-size: 12px;
                }
                .content--tutorial ul li:before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    border-radius: 6px;
                    background-color: black;
                    top: 50%;
                    margin-top: -4px;
                    position: absolute;
                    left: 0;
                    font-weight: bold;
                    font-size: 12px;
                }
                `
            }</style>
        </>
    )
}