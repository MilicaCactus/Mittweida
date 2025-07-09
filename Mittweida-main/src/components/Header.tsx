import "./Header.css";
import CatImage from "../assets/Cat.jpg";
import MapsImage from "../assets/maps.jpg";



const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <img src={CatImage} alt="Cat" className="cat-image" />
            </div>

            <div className="title-group">
                <h1 className="title">MITTWEIDA</h1>
                <p className="subtitle">News & Places</p>
            </div>

            <div className="header-right">
                <img src={MapsImage} alt="Maps" className="maps-image" />
            </div>
        </header>
    );
};

export default Header;
