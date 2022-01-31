import { isEmpty, isArray } from 'lodash';
import React, { useState, useEffect } from "react";
import client from '../ApolloClient';
import {GET_PRODUCTS} from '../../queries/products/get-products';
import ProductSlider from '../product/ProductSlider';
import Title from '../commons/Title';
import cx from 'classnames';
import Button from '../commons/Button';
import Latests from '../product/Latests';

const getProducts = function($first = 12, $after = '', $query = {}) {
    return client.query({
        query: GET_PRODUCTS,
        variables: { first : $first, after: $after, query: $query }
    });
};

const Related = (props)=> {
    const slides = 2,
        className = cx('columns', 'columns--shrink', 'columns--shrink-left-md', 'columns--grow-140-bottom'),
        title = {
            content: props.title,
            size: 'title--font-size-38',
            type: 'h3'
        },
        button = {
            link: {
                url: '/prodotti/',
                title: 'Vedi tutti',
            },
        },
        products = props?.products;
    
    return (
        <>
        { !isEmpty(products) && isArray( products ) && <>
            <div className="row row--shrink">
                <header className="header header--products">
                    <Title title={title}/>
                    <Button btn={button} />
                </header>
            </div>
            <div className={className}>
                <div className="column column--products-desc column--s3" dangerouslySetInnerHTML={{ __html: props.content}}></div>
                <div className="column column--products column--products-slider  column--s9">
                    <ProductSlider products={products} slides={slides}/>
                </div>
            </div>
        </> }
        </>
    );
}

export default Related;



