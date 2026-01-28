import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket, faTags, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../store/cart-context";
import { useAuth } from "../store/auth-context";
import { useState } from "react";

export default function Header() {
  const { totalQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  // 控制使用者選單開關
const [isUserMenuOpen, setUserMenuOpen] = useState(false);

// 控制管理員選單開關
const [isAdminMenuOpen, setAdminMenuOpen] = useState(false);

// 模擬角色權限 (未來會改為動態判斷)
const isAdmin = true;


// 切換管理員選單
const toggleAdminMenu = () => {
    setAdminMenuOpen(prev => !prev); 
};

// 切換使用者選單
const toggleUserMenu = () => {
    setUserMenuOpen(prev => !prev);
};

  // 定義導航連結樣式
  const navLinkClass =
    "text-center text-lg font-primary font-semibold text-primary py-2 hover:text-gray-600 transition duration-200";

  // 定義下拉選單連結樣式
  const dropdownLinkClass =
    "block w-full text-left px-4 py-2 text-base font-primary font-semibold text-gray-700 hover:bg-gray-100 transition duration-200";

  return (
    <header className="border-b border-gray-300 sticky top-0 z-20 bg-gray-100 shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-[1152px] px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary hover:text-gray-700 transition">
          <FontAwesomeIcon icon={faTags} className="h-8 w-8" />
          <span className="font-bold text-2xl font-primary">Eazy Stickers</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center z-10">
          <ul className="flex items-center space-x-8">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? `underline underline-offset-4 ${navLinkClass}` : navLinkClass
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? `underline underline-offset-4 ${navLinkClass}` : navLinkClass
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? `underline underline-offset-4 ${navLinkClass}` : navLinkClass
                }
              >
                Contact
              </NavLink>
            </li>

            {/* Login / User Dropdown Logic */}
            <li className="relative group">
              {isAuthenticated ? (
                /* --- 登入後顯示的區塊 (Dropdown Menu) --- */
                <div className="relative">
                  {/* User Button */}
                  <button 
                  onClick={toggleUserMenu}
                  className={`flex items-center gap-1 focus:outline-none ${navLinkClass}`}>
                    <span>Hello John Doe</span>
                    <FontAwesomeIcon icon={faAngleDown} className="text-sm" />
                  </button>

                  {isUserMenuOpen && ( 
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-50">
                    <ul className="py-1">
                      <li>
                        <Link to="/profile" className={dropdownLinkClass}>
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/orders" className={dropdownLinkClass}>
                          Orders
                        </Link>
                      </li>


                      {isAdmin && (<li className="border-t border-gray-100">
                        <button 
                          onClick={toggleAdminMenu}
                          className={`flex items-center justify-between ${dropdownLinkClass} w-full`}>
                          Admin
                          <FontAwesomeIcon icon={faAngleDown} size="xs" />
                        </button>

                        {isAdminMenuOpen && (<ul className="bg-gray-50">
                          <li>
                            <Link to="/admin/orders" className={`${dropdownLinkClass} pl-8 text-sm`}>
                              Orders
                            </Link>
                          </li>
                          <li>
                            <Link to="/admin/messages" className={`${dropdownLinkClass} pl-8 text-sm`}>
                              Messages
                            </Link>
                          </li>
                        </ul>)}
                        
                      </li>)}
                     
                      

                      <li className="border-t border-gray-100">
                        <Link to="/home" className={`${dropdownLinkClass} text-red-600 hover:bg-red-50 hover:text-red-700`}>
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>) 
                }                
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? `underline underline-offset-4 ${navLinkClass}` : navLinkClass
                  }
                >
                  Login
                </NavLink>
              )}
            </li>

            {/* Shopping Cart Icon */}
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