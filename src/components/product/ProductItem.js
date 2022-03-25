import { isEmpty, isNull } from 'lodash';
import Link from 'next/link';
import Title from '../commons/Title';
import Image from "../../image";
import cx from 'classnames';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
export default function ProductItem({product}) {
    const { data : session, status } = useSession();
    
    const title = {
        size : 'title--font-size-16',
        type : 'h2',
        content: product.name,
    }
    const picture = product?.image || '';
    const [ item, setItem ] = useState(product);
    useEffect( () => {
        if( status === 'authenticated') {
            let getRole;
            session?.user?.roles?.nodes.map((r) => {
                getRole = r?.name !== 'customer' ? r?.name : null;
            });
            if( !isNull( product?.userVisibility ) && getRole !== 'customer' && getRole !== 'administrator' && !isNull(getRole) ) {
                product?.userVisibility.map((uItem)=> {
                    if( uItem?.id === session?.user?.databaseId || uItem?.key === getRole) {
                        const newItem = {
                            price: uItem?.price
                        }

                        if( uItem?.stock ) {
                            newItem.stock = uItem?.stock;
                        }
                        setItem({
                            ...item,
                            ...newItem
                        });
                    }
                });
            }
        }
    }, [ status ]);
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
                        !isEmpty(product.salePrice) || parseFloat( item?.price ) < parseFloat( product?.price ) ? 
                         <del>{product.regularPrice}</del>   : ''
                    }

                    {item?.price}
                </strong>
            </a>
        </Link>
    )
}