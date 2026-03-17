import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket, faTags, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useCart } from "../store/cart-context";
import { useAuth } from "../store/auth-context";

// 1. 將共用的 CSS Class 獨立在外部，保持 JSX 乾淨
const NAV_LINK_CLASS = "text-center text-lg font-primary font-semibold text-primary py-2 hover:text-gray-600 transition duration-200";
const DROPDOWN_LINK_CLASS = "block w-full text-left px-4 py-2 text-base font-primary font-semibold text-gray-700 hover:bg-gray-100 transition duration-200";

// 2. 將主要導航列「資料化」，方便日後擴充
const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef();

  const { totalQuantity } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  // 3. 狀態管理
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isAdminMenuOpen, setAdminMenuOpen] = useState(false);

  // 4. 點擊外部自動關閉選單
  useEffect(() => {
    // 換頁時自動收起選單
    setUserMenuOpen(false);
    setAdminMenuOpen(false);

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
        setAdminMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    // 重要：清除副作用，避免 memory leak
    return () => document.removeEventListener("mousedown", handleClickOutside); 
  }, [location.pathname]);

  // 5. 事件處理
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    toast.success("Logged out successfully!");
    navigate("/home");
  };

  // 輔助函式：判斷 NavLink 是否為當前頁面
  const getNavLinkStyle = ({ isActive }) =>
    isActive ? `underline underline-offset-4 ${NAV_LINK_CLASS}` : NAV_LINK_CLASS;

  return (
    <header className="border-b border-gray-300 sticky top-0 z-20 bg-gray-100 shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-[1152px] px-6 py-4">
        
        {/* === Logo 區塊 === */}
        <Link to="/" className="flex items-center gap-2 text-primary hover:text-gray-700 transition">
          <FontAwesomeIcon icon={faTags} className="h-8 w-8" />
          <span className="font-bold text-2xl font-primary">Eazy Stickers</span>
        </Link>

        {/* === 導航列區塊 === */}
        <nav className="flex items-center z-10">
          <ul className="flex items-center space-x-8">
            
            {/* 1. 動態渲染一般導航 (Home, About, Contact) */}
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <NavLink to={item.path} className={getNavLinkStyle}>
                  {item.name}
                </NavLink>
              </li>
            ))}

            {/* 2. 登入/使用者選單區塊 */}
            <li className="relative group">
              {!isAuthenticated ? (
                <NavLink to="/login" className={getNavLinkStyle}>Login</NavLink>
              ) : (
                <div ref={userMenuRef} className="relative">
                  {/* 使用者按鈕 */}
                  <button 
                    onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-1 focus:outline-none ${NAV_LINK_CLASS}`}
                  >
                    <span>Hi, {user?.name?.length > 5 ? `${user.name.slice(0,5)}...` : user?.name}</span>
                    <FontAwesomeIcon icon={faAngleDown} className="text-sm" />
                  </button>

                  {/* 下拉選單 */}
                  {isUserMenuOpen && ( 
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-50">
                      <ul className="py-1">
                        <li><Link to="/profile" className={DROPDOWN_LINK_CLASS}>Profile</Link></li>
                        <li><Link to="/orders" className={DROPDOWN_LINK_CLASS}>Orders</Link></li>

                        {/* Admin 專屬選單 */}
                        {isAdmin && (
                          <li className="border-t border-gray-100">
                            <button 
                              onClick={() => setAdminMenuOpen(!isAdminMenuOpen)}
                              className={`flex items-center justify-between w-full ${DROPDOWN_LINK_CLASS}`}
                            >
                              Admin
                              <FontAwesomeIcon icon={faAngleDown} size="xs" />
                            </button>
                            {isAdminMenuOpen && (
                              <ul className="bg-gray-50">
                                <li><Link to="/admin/orders" className={`${DROPDOWN_LINK_CLASS} pl-8 text-sm`}>Orders</Link></li>
                                <li><Link to="/admin/messages" className={`${DROPDOWN_LINK_CLASS} pl-8 text-sm`}>Messages</Link></li>
                              </ul>
                            )}
                          </li>
                        )}

                        {/* 登出按鈕 */}
                        <li className="border-t border-gray-100">
                          <button 
                            onClick={handleLogout}
                            className={`w-full text-left ${DROPDOWN_LINK_CLASS} text-red-600 hover:bg-red-50 hover:text-red-700`}
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </li>

            {/* 3. 購物車圖示 */}
            <li>
              <Link to="/cart" className="relative flex items-center justify-center text-primary hover:text-gray-700 transition duration-200 p-2">
                <FontAwesomeIcon icon={faShoppingBasket} className="text-2xl" />
                {totalQuantity > 0 && (
                  <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-black shadow-sm">
                    {totalQuantity}
                  </div>
                )}
              </Link>
            </li>
            
          </ul>
        </nav>
      </div>
    </header>
  );
}