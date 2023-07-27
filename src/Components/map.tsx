import { MapProps } from "../interfaces"
import React, { useState } from "react"
import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import useUserLocation from "../hooks/useUserLocation"
import { calculateDistance } from "../utils"
import MapMarker from "./MapMarker"
import MapRadiusDropdown from "./MapRadiusDropdown"
import { mapRange } from "../data"
import useNearestPark from "../hooks/useNearestPark"

const Map: React.FC<MapProps> = ({ parks }) => {
    const [selectedRadius, setSelectedRadius] = useState<number>(mapRange[0])
    const userLocation = useUserLocation()
    const nearestPark = useNearestPark(parks)

    const handleRadiusChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedRadius(parseInt(event.target.value))
    }

    const filteredParks = parks.filter((park) => {
        if (!userLocation) return false
        const distance = calculateDistance(
            userLocation[0],
            userLocation[1],
            park.lat,
            park.lng
        )
        return distance <= selectedRadius
    })

    if (!userLocation) return <div>Loading map...</div>

    return (
        <div>
            <MapRadiusDropdown
                selectedRadius={selectedRadius}
                onChange={handleRadiusChange}
            />
            <MapContainer
                center={userLocation}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "500px", width: "500px" }}>
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapMarker location={userLocation} label="You're here" />
                {filteredParks.map(({ id, lat, lng, name }) => (
                    <MapMarker key={id} location={[lat, lng]} label={name} />
                ))}
                {nearestPark && (
                    <Polyline
                        positions={[
                            userLocation,
                            [nearestPark.lat, nearestPark.lng]
                        ]}
                    />
                )}
            </MapContainer>
        </div>
    )
}

export default Map
