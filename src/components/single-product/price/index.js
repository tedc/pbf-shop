import {isEmpty} from "lodash";
import {discountPercent} from '../../../utils/product';

const Price = ({ regularPrice = 0, salesPrice, discount = false }) => {

    if ( isEmpty( salesPrice ) ) {
    	return null;
    }

    /**
     * Get discount percent.
     *
     * @param {String} regularPrice
     * @param {String} salesPrice
     */

    const productMeta = discountPercent( regularPrice, salesPrice );

    return (
        <>
        {  discount ? (
            <>
            { productMeta?.discountPercent ? ( 
                <div className="discount">
                    {productMeta.discountPercent}
                </div>
            ) : ('')
            }
            </>
            
        ) : (
            <span className="price">
                {/* Regular price */}
                { productMeta?.discountPercent ? (
                    <>
                    {salesPrice}
                    <del>{ regularPrice }</del>
                    </>
                ) : (
                    <>{ regularPrice }</>
                ) }
            </span>
        )}
        </>
    )
}


export default Price
