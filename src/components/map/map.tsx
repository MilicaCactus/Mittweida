import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

const position: [number, number] = [ 50.9853, 12.9741]

export default function Map() {

return(
    <MapContainer center={position} zoom={10} scrollWheelZoom={true}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
            <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </Marker>
    </MapContainer>
)
}