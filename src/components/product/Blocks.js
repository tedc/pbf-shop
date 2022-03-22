import { isEmpty, isNull } from 'lodash';
import Title from '../commons/Title';
import Image from "../../image";
import cx from 'classnames';

const Icon = (props)=> {
    const {icon, text} = props;
    return (
        <div className="column column--s3-fixed column--icon">
            <Image 
                width={icon?.mediaDetails?.width}
                height={icon?.mediaDetails?.height}
                loading="lazy"
                sourceUrl={ icon?.sourceUrl ?? '' }
                srcSet={ icon?.srcSet }
                altText={ icon?.altText ?? text }
                objectFit="contain"
            />
            <p>
                { text }
            </p>
        </div>
    )
}

const Row = (props)=> {
    const {name, value} = props;
    return (
        <div className="item item--row">
            {name}
            <span>{value}</span>
        </div>
    )
}

export default function Blocks(props) {
    const { benefits, ingredients, extraRows } = props;
    const rows = [];
    if( ( !isNull(benefits.content) && !isEmpty( benefits.content) ) || ( !isNull(benefits.icons) && !isEmpty( benefits.icons) ) ) {
        rows.push(
            {
                subtitle : benefits.title,
                title : benefits.content,
                icons: benefits.icons,
                image: benefits.image,
            }
        );
    }
    if( ( !isNull(ingredients.content) && !isEmpty( ingredients.content) ) || ( !isNull(ingredients.rows) && !isEmpty( ingredients.rows) ) ) {
        rows.push(
            {
                subtitle : ingredients.title,
                title : ingredients.content,
                rows: ingredients.rows,
                image: ingredients.image,
            }
        );
    }
    if( !isNull(extraRows) && !isEmpty( extraRows) ) {
        extraRows.map((row) => {
            rows.push(
                {
                    subtitle : row.subtitle,
                    content : row.content,
                    title: row.title,
                    image: row.image,
                }
            );

        })
    }
    if(isEmpty(rows)) {
        return '';
    }
    return (
        <>
            {
                rows.map((row, index)=> (
                    <div key={`row-${index}`} className={cx('columns', 'columns--block', {'columns--reverse': index%2 === 0},{'columns--block-last': index === rows.length - 1})}>
                        <div className="column column--figure column--figure-full column--s6-sm">
                            {
                                !isEmpty(row.image) && !isNull(row.image) ? (
                                    <Image 
                                        width={row?.image?.mediaDetails?.width}
                                        height={row?.image?.mediaDetails?.height}
                                        loading="lazy"
                                        sourceUrl={ row?.image?.sourceUrl ?? '' }
                                        srcSet={ row?.image?.srcSet }
                                        altText={ row?.image?.altText ?? ''}
                                        objectFit="cover"
                                    />
                                ) : null
                            }
                            
                        </div>
                        <div className="column column--content column--s6-md">
                            <div className="product__content">
                                { !isEmpty(row.subtitle) && !isNull(row.subtitle) && <Title title={{
                                    content: row.subtitle,
                                    size: 'title--font-size-14 title--font-family-secondary title--grow-40-bottom',
                                    type: 'h3'
                                }} /> }
                                { !isEmpty(row.title) && !isNull(row.title) && <Title title={{
                                    content: row.title,
                                    size: 'title--font-size-38 title--grow-40-bottom',
                                    type: 'h2'
                                }} /> }
                                { !isEmpty(row.content) && !isNull(row.content) && <div className="content" dangerouslySetInnerHTML={{__html: row.content}}></div> }
                                { !isEmpty(row.rows) && !isNull(row.rows) ? (
                                    <>
                                    {row.rows.map((item, index)=> (
                                        <Row {...item} key={`row-item-${index}`}/>
                                    ))
                                    }
                                    </>
                                ) : ''}
                                { !isEmpty(row.icons) && !isNull(row.icons) ? (
                                    <div className="columns columns--jcc">
                                    {row.icons.map((item, index)=> (
                                        <Icon {...item} key={`row-icon-${index}`} />
                                    ))
                                    }
                                    </div>
                                ) : ''}
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    )
}