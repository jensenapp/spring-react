import React from "react";
import ProductCard from "./ProductCard";
import SearchBox from "./SearchBox";
import DropDown  from "./Dropdown";
import { useState,useMemo } from "react";

export default function ProductListings({ products }) {

  const sortList = ["Popularity", "Price Low to High", "Price High to Low"];

    const [searchText, setSearchText] = useState("");
    const [selectedSort,setSelectedSort]=useState("Popularity");



   // 使用 useMemo 包裹計算邏輯
  const filteredAndSortedProducts = useMemo(() => {
    // A. 安全性檢查：若無產品則回傳空陣列
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }

    // B. Filtering Logic (過濾邏輯)
    // 根據 searchText 過濾產品名稱或描述
    let filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase())
    );

    // C. Sorting Logic (排序邏輯)
    // 注意：使用 slice() 建立淺拷貝，避免直接修改原始 filteredProducts 陣列 (Sort 是會改變原陣列的 mutation method)
    return filteredProducts.slice().sort((a, b) => {
        switch (selectedSort) {
            case "Price Low to High":
                return a.price - b.price;
            case "Price High to Low":
                return b.price - a.price;
            case "Popularity":
            default:
                // 假設 popularity 是數值或可比較的值
                return b.popularity - a.popularity; 
        }
    });

  }, [products, searchText, selectedSort]); // D. 依賴陣列：只有這三個變數改變時，才重新執行上述邏輯

  function handleSearchChange(inputText){
    setSearchText(inputText);
}

   function handleSortChange(sortType){
    setSelectedSort(sortType);
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
