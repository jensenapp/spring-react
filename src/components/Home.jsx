import React from 'react'
import PageHeading from './PageHeading';
import ProductListings from './ProductListings';
import products from '../data/products';

export default function Home() {
  return (
   <div className='home-container'>
    <PageHeading title="Explore Eazy Stickers!">
      Add a touch of creativity to your space with our wide range of fun and
        unique stickers. Perfect for any occasion!
      </PageHeading>
      <ProductListings products={products}/>
   </div>
  );
};

