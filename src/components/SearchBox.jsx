

export default function SearchBox({ label, placeholder, value ,handleSearch}) {





  return (
    // 外層容器：Flex 排版、垂直置中、間距設定
    <div className="flex items-center gap-3 pl-4 flex-1 font-primary">
      
      {/* Label 區域 */}
      <label className="text-lg font-semibold text-primary">
        {label}
      </label>

      {/* Input 區域 */}
      <input
        type="text"
        className="px-4 py-2 text-base border rounded-md transition border-primary focus:ring focus:ring-dark focus:outline-none text-gray-800"
        placeholder={placeholder}
        value={value} 
        onChange={(e)=>handleSearch(e.target.value)}
      />
    </div>
  );
}