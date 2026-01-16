import React from "react";
import ProductCard from "./ProductCard";
import SearchBox from "./SearchBox";
import DropDown  from "./Dropdown";
import { useState } from "react";

export default function ProductListings({ products }) {

  const sortList = ["Popularity", "Price Low to High", "Price High to Low"];

    const [searchText, setSearchText] = useState("");

  function handleSearchChange(inputText){
    setSearchText(inputText);
  console.log(inputText);
}


  return (
    <div className="max-w-[1152px] mx-auto">
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBox 
        label="Search" 
        placeholder="Search products..." 
        value={searchText} 
        handleSearch={(value)=>handleSearchChange(value)}
      />
        <DropDown 
        label="Sort by"
        options={sortList}
        value="Popularity" // 暫時寫死預設值
      />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6 py-12">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))
        ) : (
          <p className="text-center font-primary font-bold text-lg text-primary">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}
