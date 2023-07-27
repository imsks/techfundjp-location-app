import { MapProps, Park } from "../interfaces"
import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import useUserLocation from "../hooks/useUserLocation"
import { calculateDistance } from "../utils"
import MapMarker from "./MapMarker"

const Map: React.FC<MapProps> = ({ parks }) => {
    const [selectedRadius, setSelectedRadius] = useState<number>(1000)
    const [nearestPark, setNearestPark] = useState<Park>()
    const userLocation = useUserLocation()

    useEffect(() => {
        if (userLocation && parks) {
            const nearest: any = parks.reduce(
                (nearestPark, park) => {
                    const distance = calculateDistance(
                        userLocation[0],
                        userLocation[1],
                        park.lat,
                        park.lng
                    )
                    return distance < nearestPark.distance
                        ? { ...park, distance }
                        : nearestPark
                },
                { distance: Number.MAX_SAFE_INTEGER }
            )

            setNearestPark(nearest)
        }
    }, [userLocation, parks])

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

    return (
        <div>
            {userLocation ? (
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
                        <MapMarker
                            key={id}
                            location={[lat, lng]}
                            label={name}
                        />
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
            ) : (
                <div>Loading map...</div>
            )}
            <div>
                <label htmlFor='radius'>Select Radius (meters):</label>
                <select
                    id='radius'
                    value={selectedRadius}
                    onChange={handleRadiusChange}>
                    <option value={1000}>1000</option>
                    <option value={2000}>2000</option>
                    <option value={3000}>3000</option>
                    <option value={5000}>5000</option>
                </select>
            </div>
        </div>
    )
}

export default Map
