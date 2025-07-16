import { supabase } from "@/lib/supabase.ts";
import "./Visiting.css";
import "leaflet/dist/leaflet.css"
import {twMerge} from "tailwind-merge";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {CurrentLocationMap} from "@/components/map/map.tsx";
import { useState, useEffect } from "react";


const Visiting = () => {
    const [visibleDescriptions, setVisibleDescriptions] = useState<boolean[]>([]);
    const [places, setPlaces] = useState([]);
    const [saved, setSaved] = useState([]);
    const [mapOpen, setMapOpen] = useState<number|null>(null);

    useEffect(() => {
        const savedItems = localStorage.getItem("saved");
        if (savedItems) {
            setSaved(JSON.parse(savedItems));
        } else {
            const emptyList = [];
            localStorage.setItem("saved", JSON.stringify(emptyList));
            setSaved(emptyList);
        }
    }, []);
    useEffect(() => {
        if (saved !== null) {
            localStorage.setItem("saved", JSON.stringify(saved));
        }
    }, [saved]);
    useEffect(() => {
        async function getPosts(){
            // const {data} = await supabase.from("posts").select("*").limit(50)
            const request = await fetch(`${import.meta.env.VITE_API_URL}/locations`)
            const places = await request.json()
            
            if (places){
                setPlaces(places)
            }
        }
        getPosts();
    }, []);
    useEffect(() => {
        console.log(places.find((place)=>place.id == mapOpen))
    }, [mapOpen]);
    const toggleDescription = (index: number) => {
        const updated = [...visibleDescriptions];
        updated[index] = !updated[index];
        setVisibleDescriptions(updated);
    };
    function pinClick(id  : number){
        setMapOpen(id)
    }
    function saveClick(id: number) {
        setSaved((prev) => {
            if (prev.some((item) => item.id === id)) {
                // Item exists, remove it
                return prev.filter((item) => item.id !== id);
            } else {
                // Item doesn't exist, add it
                return [...prev, { id, date: new Date() }];
            }
        });
    }
    return (
        <div className="visiting-container">
            <Dialog open={Number.isFinite(mapOpen)} onOpenChange={(open)=>setMapOpen(open ? mapOpen : null)}>
                {mapOpen !== null && (<DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Directions to {places.find((place)=>place.id == mapOpen)!.place_name}
                        </DialogTitle>
                    </DialogHeader>
                    <CurrentLocationMap routing={true} markers={[places.find((place)=>place.id == mapOpen)!.lat, places.find((place)=>place.id == mapOpen)!.long]} />
                </DialogContent>)}
            </Dialog>
            {places.map((place, index) => (
                <div className="visiting-card" key={index}>
                    <div className="image-container">
                        <img
                            src={place.image_url}
                            alt={place.title}
                            className="visiting-image"
                            onClick={() => toggleDescription(index)}
                        />
                    </div>
                    <div className="visiting-icon top-right cursor-pointer" onClick={()=>pinClick(place.id)}>
                        <div className="icon map-pin">📍</div>
                    </div>
                    <div className={"visiting-icon bottom-right cursor-pointer"} onClick={()=>saveClick(place.id)}>
                        <div className={twMerge("icon bookmark", saved.some(item => item.id === place.id) ? "bg-green-400" : "bg-blue-300")}>🔖</div>
                    </div>
                    <p className={`description-text ${visibleDescriptions[index] ? "show" : ""}`}>
                        <span className={"font-semibold"}>{place.place_name}</span><br/>
                        {place.description}
                    </p>
                </div>
            ))}

        </div>
    );
};

export default Visiting;