import "./Header.css";
import CatImage from "../assets/Cat.jpg";
import MapsImage from "../assets/maps.jpg";
import MapPopover from "@/components/MapPopover.tsx";
import {useState} from "react";



const Header = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <MapPopover open={open} setOpen={setOpen} markers={[]} />
            <header className="header">
                <div className="header-left">
                    <img src={CatImage} alt="Cat" className="cat-image" />
                </div>

                <div className="title-group">
                    <h1 className="title">MITTWEIDA</h1>
                    <p className="subtitle">News & Places</p>
                </div>

                <div className="header-right" onClick={()=>setOpen(true)}>
                    <img src={MapsImage} alt="Maps" className="maps-image" />
                </div>
            </header>
        </>
    );
};

export default Header;
