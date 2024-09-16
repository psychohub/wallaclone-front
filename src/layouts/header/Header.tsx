import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import MobileMenu from "../../components/menu/MobileMenu";
import Menu from "../../components/menu/Menu";
import './Header.css';

const Header = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
	
	const [openMenu, setOpenMenu] = useState<boolean>(!isMobile);

	const toggleMenu = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
		setOpenMenu(!openMenu);
	};
  
	return (
		<header className="app-header">
			<div className="logo-container">
				<Link to="/" className="logo">
					<span className="logo-blue">Walla</span>
					<span className="logo-gray">clone</span>
				</Link>
			</div>
			{
				isMobile ?
				<>
					<Button type="button" variant="outline-primary" className="app-navbar-button" onClick={toggleMenu}>
						<FontAwesomeIcon icon={faBars} size="lg" />
					</Button>
					<MobileMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />
				</>
				: <Menu />
			}
		</header>
	);
};

export default Header;
