import ProductSlider from '../product/ProductSlider';
import Title from '../commons/Title';
import cx from 'classnames';
import Button from '../commons/Button';
import Arrow from '../commons/Arrow';

export default function Latests({data, products, loading}) {
    const title = {
        content: data.title,
        size: 'title--font-size-48',
        type: 'h3'
    },
    button = {
        link: {
            url: '/prodotti/',
            title: 'Vedi tutti i prodotti',
        },
    };

    return (
        <div className="row row--latests">
            <header className="header header--latests">
                <Title title={title}/>
                <div className="desc" dangerouslySetInnerHTML={{__html: data.content}}></div>
            </header>
            <ProductSlider products={products} slides={1}/>
            <footer className="cta">
                <Button btn={button} />
                <Arrow side="right" href="/prodotti/" />
            </footer>
        </div>
    )
}