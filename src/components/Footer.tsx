import { useLocation } from "wouter"
import {BookmarkIcon, FlameIcon, LocationIcon, UserIcon} from "../assets/Icons.tsx";
import "./Header.css"
import { UploadDialog } from "../components/ButtonPopover.tsx";
import { useAuth } from "./hooks/LoginProvider.tsx";

export default function Footer() {
    const [location, setLocation] = useLocation();
    const {guard} = useAuth();
    function onClick(path : string){
        if (path == location){
            return
        }
        setLocation(path)
    }
    return (
        <footer className="bottom-nav">
            <div className={`nav-item ${location == "/" ? "on" : ""}`} onClick={()=>onClick("/")}>
                <FlameIcon />
            </div>
            <div className={`nav-item ${location == "/visiting" ? "on" : ""}`} onClick={()=>onClick("/visiting")}>
                <LocationIcon />
            </div>
            <div className={`nav-item`}>
                <UploadDialog/>
            </div>
            <div className={`nav-item ${location == "/saved" ? "on" : ""}`} onClick={()=>onClick("/saved")}>
                <BookmarkIcon />
            </div>
            <div className={`nav-item ${location == "/profile" ? "on" : ""}`} onClick={guard(()=>onClick("/profile"))}>
                <UserIcon />
            </div>
        </footer>
    )
}