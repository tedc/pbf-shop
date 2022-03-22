import Link from 'next/link';
const CartEmpty = ()=> (
    <div className="columns columns--cart-empty columns--jcc columns--grow-140 columns--shrink">
        <div className="column column--s10">
            <h2 className="title title--font-size-38 title--grow-40-bottom">Il tuo carrello è vuoto</h2>
            <Link href="/prodotti">
                <button className="button button--rounded button--bg-black">
                    Vai allo shop
                </button>
            </Link>
        </div>
    </div>
)

export default CartEmpty;