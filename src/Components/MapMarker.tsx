import { Marker, Popup } from "react-leaflet"
import { MapMarkerProps } from "../interfaces"

const MapMarker = ({ location, label }: MapMarkerProps) => {
    return (
        <Marker position={location}>
            <Popup>{label}</Popup>
        </Marker>
    )
}

export default MapMarker
