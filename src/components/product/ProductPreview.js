import Image from "../../image";
import AddToCartButton from '..//cart/AddToCartButton';
import Price from "../single-product/price";

export default function ProductPreview({product, isOpen}) {
    const image = product?.featuredImage?.node;
    return (
        <div className="product product--tooltip" key={product.databaseId}>
            { image && <figure className="product__figure"><Image
                width={image?.mediaDetails?.width}
                height={image?.mediaDetails?.height}
                loading="lazy"
                layout="fill"
                objectFit="contain"
                sourceUrl={ image?.sourceUrl ?? '' }
                srcSet={ image?.srcSet }
                altText={image?.altText ?? product.name}
            /></figure>}
            <div className="product__content">
                <Price salesPrice={product?.price} regularPrice={product?.regularPrice} discount={true} />
                <h4 className="title title--font-size-18" dangerouslySetInnerHTML={{__html: product.name}}></h4>
                <Price salesPrice={product?.price} regularPrice={product?.regularPrice}/>
            </div>
            <AddToCartButton product={ product } input={false} />
        </div>
    )
}