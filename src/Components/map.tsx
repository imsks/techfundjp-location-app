import { MapProps, Park } from "../interfaces"
import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet"

const Map: React.FC<MapProps> = ({ parks }) => {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(
        null
    )
    const [selectedRadius, setSelectedRadius] = useState<number>(1000) // Default radius in meters
    const [nearestPark, setNearestPark] = useState<Park | null>(null)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords
                setUserLocation([latitude, longitude])
            })
        }
    }, [])

    const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const R = 6371 // Radius of the Earth in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180
        const dLon = ((lon2 - lon1) * Math.PI) / 180
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c * 1000 // Convert distance to meters
        return distance
    }

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
                    <Marker position={userLocation}>
                        <Popup>Your Location</Popup>
                    </Marker>
                    {filteredParks.map((park) => (
                        <Marker key={park.id} position={[park.lat, park.lng]}>
                            <Popup>{park.name}</Popup>
                        </Marker>
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
