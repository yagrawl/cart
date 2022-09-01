import React from 'react';
import { Product } from '../components/product';
import catalog from '../data/products.json';

const Catalog = () => {
    const renderCatalog = () => {
        return catalog.products.map(item => {
            return <Product
                key={item.id} 
                title={item.title} 
                subtitle={item.subtitle} 
                id={item.id.toString()} 
                price={item.price} 
                image={item.image} />
        })
    }

    return (
        <div>
            {renderCatalog()}
        </div>
    );
}

export default Catalog;
