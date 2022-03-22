import { isEmpty, isNull } from 'lodash';
import Link from 'next/link';
import Title from '../commons/Title';
import Image from "../../image";
import cx from 'classnames';
import { useState } from 'react';
export default function ProductItem({product}) {
    const title = {
        size : 'title--font-size-16',
        type : 'h2',
        content: product.name,
    }
    const picture = product?.image || '';
    return (
        <Link href={product.uri}>
            <a className="product product--item">
                {
                    !isEmpty(picture) ? (
                        <figure className="figure figure--product">
                            <Image
                                width={picture?.mediaDetails?.width}
                                height={picture?.mediaDetails?.height}
                                loading="lazy"
                                sourceUrl={ picture?.sourceUrl ?? '' }
                                altText={picture?.altText ?? product.name}
                                objectFit="contain"
                                layout='fill'
                            />
                        </figure>
                    ) : ''
                }
                { !isNull(product?.categoryName) && <span className="category">{product?.categoryName}</span>}
                <Title title={title}/>
                <strong className="price">
                    {
                        !isEmpty(product.salePrice) ? 
                         <del>{product.regularPrice}</del>   : ''
                    }

                    {product.price}
                </strong>
            </a>
        </Link>
    )
}