import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket, faTags } from "@fortawesome/free-solid-svg-icons";

const Header=()=>{
return(
<header className="header">
    <div className="container">
       <a href="/" className="link">
       <span className="brand-title">Eazy Stickers</span>
        <FontAwesomeIcon icon={faTags} className="fa-icon"/>
       </a>
       <nav className="nav">
        <ul>
            <li className="nav-link"><a href="/">Home</a></li>
                        
            <li className="nav-link"><a href="/about">About</a></li>

            <li className="nav-link"><a href="/contact">Contact</a></li>

            <li className="nav-link"><a href="/login">Login</a></li>

            <li className="nav-link">
                <a href="/cart">
                <FontAwesomeIcon icon={faShoppingBasket}/>
                </a>
        
            </li>

        </ul>
       </nav>
    </div>
</header>
);
};

export default Header;