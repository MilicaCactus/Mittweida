import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase.ts";
import {twMerge} from "tailwind-merge";

export default function Saved() {
    // Removed unused posts state
    const [visibleDescriptions, setVisibleDescriptions] = useState<boolean[]>([]);
    const [places, setPlaces] = useState([]);
    const [saved, setSaved] = useState(null);
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
            async function getPlaces(){
                const response = await fetch(`${import.meta.env.VITE_API_URL}/locations`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });
                const places = await response.json();
                if (places){
                    setPlaces(places)
                }
            }
            getPlaces();
    }, []);
    const toggleDescription = (index: number) => {
        const updated = [...visibleDescriptions];
        updated[index] = !updated[index];
        setVisibleDescriptions(updated);
    };

    
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
            {saved && saved.length == 0 && (
                <p>No saved places!</p>
            )}
            { saved && places.filter((place)=>saved.flatMap((save)=>save.id).includes(place.id)).map((place, index)=>(
                <div className="visiting-card" key={index}>
                    <div className="image-container">
                        <img
                            src={place.image_url}
                            alt={place.title}
                            className="visiting-image"
                            onClick={() => toggleDescription(index)}
                        />
                    </div>
                    <div className="visiting-icon top-right cursor-pointer" >
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
    )
}