import React from "react";
import ProductCard from "./ProductCard";
import SearchBox from "./SearchBox";
import DropDown  from "./Dropdown";
import { useState } from "react";

export default function ProductListings({ products }) {

  const sortList = ["Popularity", "Price Low to High", "Price High to Low"];

    const [searchText, setSearchText] = useState("");
    const [selectedSort,setSelectedSort]=useState("Popularity");

  function handleSearchChange(inputText){
    setSearchText(inputText);
}

   function handleSortChange(sortType){
    setSelectedSort(sortType);
}

// 這段邏輯在每次渲染時都會執行
let filteredAndSortedProducts = Array.isArray(products) && products.length > 0 
  ? products.filter((product) => {
      // 將名稱與搜尋文字都轉為小寫比對 (Case-insensitive)
      // 比對範圍包含：產品名稱 (Name) 或 描述 (Description)
      return (
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase())
      );
    })
  : []; // 若無產品資料，回傳空陣列


  //排序邏輯
switch (selectedSort) {
  case "Price High to Low":
        filteredAndSortedProducts=filteredAndSortedProducts.sort((a,b)=>{
      return parseFloat(b.price)-parseFloat(a.price);
    });
    break;

    case "Price Low to High":
        filteredAndSortedProducts=filteredAndSortedProducts.sort((a,b)=>{
      return parseInt(a.price)-parseInt(b.price);
    });
    break;

    case "Popularity":
  default:
    filteredAndSortedProducts=filteredAndSortedProducts.sort((a,b)=>{
      return parseInt(b.popularity)-parseInt(a.popularity);
    });
    break;
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
        value={selectedSort} 
        handleSort={(value)=>handleSortChange(value)}
      />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6 py-12">
        {filteredAndSortedProducts.length > 0 ? (
          filteredAndSortedProducts.map((product) => (
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
