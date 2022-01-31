import { signOut } from "next-auth/react";
import cx from 'classnames'
import { AppContext } from "../context/AppContext";
import { useContext } from 'react';
import { SpinnerDotted } from 'spinners-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { isUndefined, isEmpty } from 'lodash';

const NotLogged = ()=> {
    const { setShowLogin } = useContext( AppContext );
    return (
        <div className="account__login">
            <p>Devi accedere per consultare l'area clienti del sito.</p>
            <button className="button button--rounded button--bg-black" onClick={()=>setShowLogin(true)}>Entra</button>
            <style jsx>
                {
                    `.account__login {
                        text-align:center;
                        padding: 40px 0;
                    }
                    @media screen and (min-width:40em) {
                        .account__login {
                            padding: 80px 0;
                        }
                    }
                    .account__login p {
                        font-size: 20px;
                        margin-bottom: 40px;
                    }
                    `
                }
            </style>
        </div>
    )
}
export default function Wrapper(props) {
    const { session, group } = props;
    const router = useRouter();
    const getRole = () => {
        let r;
        session?.user?.roles?.nodes.map((role) => {
            r = role?.displayName;
        })
        return r;
    }
    const menu = [
        {
            'url' : '/area-clienti/',
            'label' : 'Informazioni personali',
        },
        {
            'url' : '/area-clienti/fatturazione/',
            'label' : 'Informazioni di fatturazione',
        },
        {
            'url' : '/area-clienti/spedizione/',
            'label' : 'Informazioni di spedizione',
        },
        {
            'url' : '/area-clienti/ordini/',
            'label' : 'Ordini',
        },
    ];

    if( ! isEmpty( group ) ) {
        menu.push({
            'label' : 'Rete',
            'url' : '/area-clienti/rete/',
            'sub' : [
                {
                    'url' : '/area-clienti/rete/',
                    'label' : `${getRole()} (${group.length})`,
                },
                {
                    'url' : '/area-clienti/rete/aggiungi-utente/',
                    'label' : 'Aggiungi utente',
                }
            ]
        });
    }
    menu.push({
        'url' : '/area-clienti/corsi-tutorial/',
        'label' : 'Corsi e tutorial'
    });

    return (
        <>
        <div className={cx('account')}>
            <div className="columns columns--shrink columns--grow-140-bottom columns--jcc">
                <div className="column column--s10-lg">
                    { !session?.user ? (<NotLogged />) : (
                    <div className="columns columns--jcsb">
                        <aside className="column column--grow-80-bottom column--s3-lg column--s4-md column--aside">
                            <h1 className="title title--font-family-secondary title--normal title--grow-40-bottom title--font-size-24">Il mio account</h1>
                            <p className="paragraph">Benvenuto <strong>{session?.user?.customer?.displayName ? session?.user?.customer?.displayName : session?.user?.nicename}</strong><br/>
                            <span className="role">{getRole()}</span>
                            </p>
                            <ul className="account__nav">
                                { menu.map((item, index)=> {
                                    if( !isUndefined(item?.sub)) {
                                        return (
                                            <li key={`${item.label}-${index}`} className={cx('account__li', {'account__li--active' : router?.asPath.indexOf(item.url) !== -1})}>
                                                <Link href={`${item.url}`}>
                                                    <a dangerouslySetInnerHTML={{__html:item.label}}>
                                                    </a>
                                                </Link>
                                                <ul className="account__subnav">
                                                    { item?.sub.map((el, index)=> 
                                                        ( <li key={`${el.url}-${index}`} className={cx('account__li', {'account__li--active' : router?.asPath === el.url})}>
                                                            <Link href={`${el.url}`}>
                                                                <a dangerouslySetInnerHTML={{__html:el.label}}>
                                                                </a>
                                                            </Link>
                                                        </li>
                                                        ))
                                                    }
                                                </ul>
                                            </li>
                                        )
                                    } else {
                                        return (
                                            <li key={`${item.url}-${index}`} className={cx('account__li', {'account__li--active' : item.url.indexOf('corsi') !== -1 ? router?.asPath.indexOf(item.url) !== -1 : router?.asPath === item.url})}>
                                                <Link href={`${item.url}`}>
                                                    <a dangerouslySetInnerHTML={{__html:item.label}}>
                                                    </a>
                                                </Link>
                                            </li>
                                        )
                                    }
                                }) }
                            </ul>
                            <button className="button button--bg-black button--rounded" onClick={()=>signOut({ redirect: true })}>Esci</button>
                        </aside>
                        <div className="column column--relative column--s8-lg column--s7-md">
                            { props.children }
                        </div>
                    </div> 
                    ) }
                </div> 
            </div>
        </div>
        <style jsx>{
            `
            .account {
                transition: opacity .5s;
            }
            .account .column--aside p {
                margin-bottom: 30px;
            }
            .account--loading {
                opacity: 0;
            }
            .account .role {
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: -0.02em;
            }
            .account__nav {
                margin: 20px 0 40px;
                border-top: 1px solid #000;
            }
            .account__li {
                padding-top: 20px;
            }
            .account__li--active > a {
                font-weight: bold;
            }
            .account__subnav {
                padding: 10px 0 20px 15px;
            }
            .account__subnav .account__li {
                padding-top: 10px;
                font-size: 12px;
            }
            `
        }</style>
        </>
    )
}