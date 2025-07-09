import {MapContainer, TileLayer, useMap} from "react-leaflet";
import {useUserLocation} from "@/components/hooks/location.tsx";
import {useEffect} from "react";
import 'leaflet';
import * as L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import {LatLng} from "leaflet";

type MarkerProps = [number, number][]

export function CurrentLocationMap({markers} : {markers : MarkerProps}) {
    const { location, error } = useUserLocation();
    return (
        <MapContainer className={"map"} center={[50.98742896250741, 12.960397827963215 ]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RoutingMachine waypoints={[[50.98742896250741, 12.960397827963215 ], ...markers]} />
        </MapContainer>
    );
}

function RoutingMachine({waypoints}: {waypoints: MarkerProps[]}) {
   const map = useMap()
    useEffect(() => {
        if (!map) return
        const control = (L.Routing).control({
            waypoints: waypoints.map((waypoint) => (new LatLng(waypoint[0], waypoint[1])))

        }).addTo(map);
    }, [map]);
   return null
}