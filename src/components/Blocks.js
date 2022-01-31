import { isEmpty, isArray } from 'lodash';
import Hero from './blocks/Hero';
import Cover from './blocks/Cover';
import Scroller from './blocks/Scroller';
import Products from './blocks/Products';
import Categories from './blocks/Categories';
import Quiz from './blocks/Quiz';
import News from './blocks/News';
import Newsletter from './blocks/Newsletter';
import ShopByColor from './blocks/ShopByColor';

export default function Blocks({blocks, products, databaseId}) {
    if( isEmpty(blocks) || !isArray(blocks)) {
        return null;
    }
    return (
        <>
        {
            blocks.map( (block, index) => {
                const blockId = `${block.name.replace('/', '-')}-${index}-${databaseId}`;
                if(block.name === 'acf/hero') {
                    return (
                        <Hero key={blockId} hero={block.hero} blockId={blockId} />
                    )
                } else if (block.name === 'acf/cover') {
                    return (
                        <Cover key={blockId} cover={block.cover} blockId={blockId} />
                    )
                }
                else if (block.name === 'acf/scroller') {
                    return (
                        <Scroller key={blockId} scroller={block.scroller} blockId={blockId} />
                    )
                } 
                else if (block.name === 'acf/products') {
                    const data = JSON.parse(block.attributes.data);
                    const bloccoProdotti = block.bloccoProdotti;
                    return (
                        <Products key={blockId} {...{products: products, title: bloccoProdotti.title, content: bloccoProdotti.content, title: bloccoProdotti.title, timer: bloccoProdotti.timer, kind: bloccoProdotti.kind, data : data}} blockId={blockId} />
                    )
                }
                else if (block.name === 'acf/categories') {
                    const slider = block.categorie.categorySlider;
                    return (
                        <Categories key={blockId} {...slider} blockId={blockId} />
                    )
                }
                else if (block.name === 'acf/shopbycolor') {
                    return (
                        <ShopByColor key={blockId} {...block.slider} blockId={blockId} />
                    )
                }
                else if (block.name === 'acf/quiz') {
                    return (
                        <Quiz key={blockId} {...block.quiz} blockId={blockId} />
                    )
                }
                else if (block.name === 'acf/news') {
                    return (
                        <News key={blockId} {...block.bloccoNews} blockId={blockId} />
                    )
                }
                else if (block.name === 'acf/newsletter') {
                    return (
                        <Newsletter key={blockId} {...block.newsletter} blockId={blockId} />
                    )
                }
                else {
                    return '';
                }
            } )
        }
        </>
    )
}