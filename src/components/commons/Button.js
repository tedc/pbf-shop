import { isUndefined } from 'lodash';
import Link from 'next/link';
import cx from 'classnames';
import { gsap } from 'gsap/dist/gsap';
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";

const Button = ({btn})=> {
    gsap.registerPlugin(ScrollToPlugin);
    const link = btn.link.url,
        title = btn.link.title,
        minWidth = !isUndefined(btn.minWidth) ? btn.minWidth : false;
    let classname = cx('button', 'button--rounded'); 
    classname = btn.color === 'white' ? cx(classname, `button--bg-white`) : cx(classname, `button--bg-black`);
    classname += minWidth ? ' button--min-width' : '';
    const ScrollTo = (event, link)=> {
        event.preventDefault();
        gsap.to(window, {
            scrollTo: link,
            duration: 1
        })
    }
    return (
        <>
        { btn.kind !== 'scroll' ? (
                <Link href={link}>
                    <a className={classname}>
                        {title}
                    </a>
                </Link>
            ) : (
                <a href={link} className={classname} onClick={(event)=>ScrollTo(event, link)}>
                    {title}
                </a>
            )
        }
        </>
    );
}

export default Button;