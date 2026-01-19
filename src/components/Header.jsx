import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket, faTags } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link} from "react-router-dom";
import { NavLink } from 'react-router-dom';


export default function Header() {
  const navLinkClass =
    "text-center text-lg font-primary font-semibold text-primary py-2";

    const[theme,setTheme]=useState("light");


  return (
    <header className="border-b border-gray-300 sticky top-0 z-20 bg-gray-100">
      <div className="flex items-center justify-between mx-auto max-w-[1152px] px-6 py-4">
        <Link to="/" className={navLinkClass}>
          <FontAwesomeIcon icon={faTags} className="h-8 w-8" />
          <span className="font-bold">Eazy Stickers</span>
        </Link>
        <nav className="flex items-center py-2 z-10">
          
          <ul className="flex space-x-6">
            <li>
              <NavLink to="/" className={({ isActive }) => 
    isActive ? `underline ${navLinkClass}` : navLinkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => 
    isActive ? `underline ${navLinkClass}` : navLinkClass}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => 
    isActive ? `underline ${navLinkClass}` : navLinkClass}>
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className={({ isActive }) => 
    isActive ? `underline ${navLinkClass}` : navLinkClass}>
                Login
              </NavLink>
            </li>
            <li>
              <Link to="/cart" className="text-primary py-2">
                <FontAwesomeIcon icon={faShoppingBasket} />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

// export default Header;
