import Link from 'next/link';
const CheckoutCartItem = ( { item } ) => {

	return (
		<div className="checkout__item" key={ item.productId }>
            <Link href={{
                    pathname: "/prodotti/[slug]",
                    query: {
                        slug : item.slug
                    }
                }}>
			<a>{ item.name } x{item.qty}</a>
            </Link>
			<div>{ item.totalPrice }</div>
		</div>
	)
};

export default CheckoutCartItem;
