import {MapContainer, Marker, TileLayer, useMap} from "react-leaflet";
import {useUserLocation} from "@/components/hooks/location.tsx";
import {useEffect, useState} from "react";
import * as L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import {LatLng} from "leaflet";
import {supabase} from "@/lib/supabase.ts";

export type MarkerProps = [number, number][]

export function CurrentLocationMap({markers, routing=false} : {markers : MarkerProps, routing : boolean}) {
    const { location, error } = useUserLocation();
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        async function getPosts(){
            const {data: places, error : error} = await supabase.from("locations").select("*")
            if (places){
                setPlaces(places)
            }
            console.log(places.map((i)=>new LatLng(i.lat, i.long)))
        }
        if (markers){
            console.log(markers)
            setPlaces([markers])
        }
        else { 
            getPosts();
        }

    }, []);
    if (places.length == 0) return <></>
    return (
        <MapContainer className={"map"} center={[50.98742896250741, 12.960397827963215 ]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            { routing ?
                <RoutingMachine
                    waypoints={[[50.98742896250741, 12.960397827963215], ...places]}
                />
                : places.map((i) => [i.lat, i.long]).map((place)=>{
                    return (<Marker position={[place[0],place[1]]} />)
                })
            }
        </MapContainer>
    );
}

function RoutingMachine({waypoints}: {waypoints: MarkerProps}) {
   const map = useMap()
    useEffect(() => {
        if (!map) return
        const control = (L.Routing).control({
            waypoints: waypoints.map((waypoint) => (new LatLng(waypoint[0], waypoint[1])))
        }).addTo(map);
    }, [map]);
   return null
}