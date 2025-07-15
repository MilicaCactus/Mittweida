import "./Header.css";
import CatImage from "../assets/Cat.jpg";
import MapsImage from "../assets/maps.jpg";
import MapPopover from "@/components/MapPopover.tsx";
import {useEffect, useState} from "react";
import { useAuth } from "./hooks/LoginProvider";
import { Button } from "./ui/button";
import { useLocation } from "wouter";



const Header = () => {
    const [open, setOpen] = useState(false);
    const {guard} = useAuth()
    const user = useAuth()
    const [, navigate] = useLocation();
    useEffect(()=>{
        console.log("User Auth State:", user);
    })
    return (
        <>
            <MapPopover open={open} setOpen={setOpen} markers={[]} />
            <header className="header">
                {user.isLoggedIn ? 
                    <div className="cursor-pointer" onClick={()=>{navigate("/profile")}}>
                        <img src={CatImage} alt="Cat" className="cat-image" />
                    </div>
                    : <Button onClick={guard(()=>{})} className="cursor-pointer">
                        Login
                    </Button>
                }
                <div className="title-group">
                    <h1 className="title">MITTWEIDA</h1>
                    <p className="subtitle">News & Places</p>
                </div>

                <div onClick={()=>setOpen(true)}>
                    <img src={MapsImage} alt="Maps" className="maps-image" />
                </div>
            </header>
        </>
    );
};

export default Header;
