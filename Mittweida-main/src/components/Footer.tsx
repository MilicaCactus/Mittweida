import { useLocation } from "wouter"
import {BookmarkIcon, FlameIcon, LocationIcon, PlusIcon, UserIcon} from "../assets/Icons.tsx";
import "./Header.css"
import {UploadDialog} from "../components/ButtonPopover.tsx";

export default function Footer() {
    const [location, setLocation] = useLocation();
    function onClick(path : string){
        if (path == location){
            return
        }
        setLocation(path);
    }
    return (
        <footer className="bottom-nav">
            <div className={`nav-item ${location == "/" ? "on" : ""}`} onClick={()=>onClick("/")}>
                <FlameIcon />
            </div>
            <div className={`nav-item ${location == "/visiting" ? "on" : ""}`} onClick={()=>onClick("/visiting")}>
                <LocationIcon />
            </div>
            <div className={`nav-item ${location == "/" ? "on" : ""}`}>
                <UploadDialog/>
            </div>
            <div className={`nav-item ${location == "/saved" ? "on" : ""}`} onClick={()=>onClick("/saved")}>
                <BookmarkIcon />
            </div>
            <div className={`nav-item ${location == "/profile" ? "on" : ""}`} onClick={()=>onClick("/profile")}>
                <UserIcon />
            </div>
        </footer>
    )
}