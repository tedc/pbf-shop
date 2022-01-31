import { isEmpty, isNull } from 'lodash';
import Button from '../commons/Button';
import Title from '../commons/Title';
import Image from "../../image";
import cx from 'classnames';

export default function Hero({hero}) {
    const button = {
            kind: hero.buttonKind,
            link: hero.button,
            minWidth: true,
            color: 'white',
        };

    let titleClass = cx(hero.titleSize === '60' ? 'title--font-size-80' : 'title--font-size-100');
    titleClass = !isEmpty(button.link.url) ? cx(titleClass, 'title--grow-40-bottom') : titleClass;
    
    const title = {
            size: titleClass,
            content:  hero.title
        }
    const {picture} = hero;

    return (
        <header className='hero'>
            <Image
                width={picture?.mediaDetails?.width}
                height={picture?.mediaDetails?.height}
                loading="lazy"
                sourceUrl={ picture?.sourceUrl ?? '' }
                altText={picture?.altText ?? title}
                layout="fill"
            />
            <div className="hero__container">
                <Title title={title} />
                {   
                    !isEmpty(button.link.url) ? (
                        <Button btn={button}/>
                    ) : (
                        ''
                    )          
                }
            </div>
        </header>
    )
}