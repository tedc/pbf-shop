import { signOut } from "next-auth/react";
import cx from 'classnames'
import { SpinnerDotted } from 'spinners-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { isUndefined, isEmpty } from 'lodash';
import NotLogged from './NotLogged';


export default function Wrapper(props) {
    const { session, group } = props;
    const router = useRouter();
    let isWholeSaler = false;
    const getRole = () => {
        let r;
        session?.user?.roles?.nodes.map((role) => {
            r = role?.displayName;
            if( role?.name === 'wholesaler' ) {
                isWholeSaler = true;
            }
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


    if( isWholeSaler ) {
        const sub = [

        ];
        if( !isEmpty(group) ) {
            sub.push({
                'url' : '/area-clienti/rete/parrucchieri/',
                'label' : `Parrucchieri (${group.length})`,
            })
        }
        sub.push({
            'url' : '/area-clienti/rete/aggiungi-utente/',
            'label' : 'Aggiungi utente',
        })
        menu.push({
            'label' : 'Rete',
            'url' : '/area-clienti/rete/',
            'sub' : sub
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
                    { !session?.user ? (<NotLogged {...props} />) : (
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