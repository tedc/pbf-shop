import { isEmpty } from 'lodash';
import Button from '../commons/Button';
import Title from '../commons/Title';
import Image from '../../image';
import cx from 'classnames';
export default function Cover({cover}) {
    const button = {
            kind: cover.buttonKind,
            link: cover.button,
            minWidth: true,
            color: 'white',
        },
        title = {
            size: !isEmpty(button.link.url) ? cx('title--font-size-60', 'title--grow-40-bottom') : cx('title--font-size-60'),
            content:  cover.title,
            type: 'h2'
        },
        subtitle = {
            size: cx('title--font-size-12', 'title--font-family-secondary', 'title--grow-40-bottom'),
            content:  cover.subtitle,
            type: 'h3'
        };
    const {picture} = cover;
    const columnsClassName = cx('columns', 'columns--grow-100', 'columns--shrink', 'columns--jcc', 'columns--relative', 'columns--aligncenter', 'columns--color-white');
    const colClassName = cx('column', 'column--relative', 'column--s9-md', 'column--s7-lg', 'column--s5-xl');
    let rowClassName = cx('row');
    rowClassName = cover.nomargin ? rowClassName : cx(rowClassName, 'row--grow-140-bottom');
    return (
        <div className={rowClassName}>
            <div className={columnsClassName}>
                {   
                    !isEmpty(picture) ? (
                        <Image
                            width={picture?.mediaDetails?.width}
                            height={picture?.mediaDetails?.height}
                            loading="lazy"
                            sourceUrl={ picture?.sourceUrl ?? '' }
                            altText={picture?.altText ?? title}
                            layout="fill"
                        />
                    ) : (
                        ''
                    )          
                }      
                
                <div className={colClassName}>
                    {   
                        !isEmpty(cover.subtitle) ? (
                            <Title title={subtitle} />
                        ) : (
                            ''
                        )          
                    }
                    <Title title={title} />
                    {   
                        !isEmpty(button.link.url) ? (
                            <Button btn={button}/>
                        ) : (
                            ''
                        )          
                    }
                </div>
            </div>
        </div>
    )
}