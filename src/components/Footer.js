import {Facebook, Instagram, Twitter, Youtube, Logo, Credits} from "./icons";
import Link from 'next/link';
import NewsletterForm from './commons/NewsletterForm';
import { isEmpty } from 'lodash';
const SocialIcon = ({service})=> {
    if(service === 'Facebook') {
        return (<Facebook />)
    } else if(service === 'Instagram') {
        return (<Instagram />)
    } else if(service === 'Twitter') {
        return (<Twitter />)
    } else if(service === 'Youtube') {
        return (<Youtube />)
    } else {
        return ('');
    }
}

const Footer = (props) => {
    const menus = props.menus?.edges;
    let menu; 
    menus.map((item)=> {
        const node = item.node;
        if(node?.locations?.indexOf('FOOTER_NAVIGATION') !== -1) {
            menu = node;
        }
    });
    const menuItems = menu?.menuItems?.nodes ?? [];
    const text = props?.options?.footerCopyright;
    const social = props?.options?.footerSocial
	return (
        <footer className="footer">
            <div className="columns columns--shrink columns--grow-40">
                <div className="column column--s6-sm column--s3-md">
                    <Link href="/">
                        <a className="brand">
                            <Logo />
                        </a>
                    </Link>
                </div>
                <div className="column column--s6-sm column--s3-md">
                    { !isEmpty( menuItems ) ? (
                        <ul className="menu">
                            { 
                                menuItems.map((item, index)=> {
                                    return( 
                                    <li className="menu__item" key={`{item.databaseId}-${index}`}>         
                                    {
                                        item.url.indexOf(process.env.NEXT_PUBLIC_WORDPRESS_URL) !== -1 ? (
                                            <Link href={item.path}>
                                                <a className="menu__link" dangerouslySetInnerHTML={{__html : item.label}}></a>
                                            </Link>

                                        ) : (
                                            <a href={ item.url } dangerouslySetInnerHTML={ { __html: item.label }} target="_blank"></a>
                                        )
                                    }
                                    </li>
                                    )
                                })
                            }
                        </ul>
                    ): ('' )}
                </div>
                <div className="column column--s6-sm column--s3-md">
                    <NewsletterForm />
                </div>
                <div className="column column--s6-sm column--s3-md">
                    <nav className="social">
                    { social.map((service)=> (
                        <a href={ service.footerSocialLink} target="_blank" key={service.footerSocialService}>
                            <SocialIcon service={service.footerSocialService}/>
                        </a>
                    ))}
                    </nav>
                </div>
            </div>
            <div className="columns columns--shrink">
                <div className="column column--s6-xs">
                    <p  dangerouslySetInnerHTML={ { __html: text } }></p>
                </div>
                <div className="column column--s6-xs">
                    <a className="credits" href="https://www.bspkn.it" target="_blank">
                        <Credits />
                    </a>
                </div>
            </div>
        </footer>
    )
};

export default Footer;
