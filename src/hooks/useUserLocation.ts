import { useEffect, useState } from "react"

const useUserLocation = () => {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(
        null
    )

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords
                setUserLocation([latitude, longitude])
            })
        }
    }, [])

    return userLocation
}

export default useUserLocation
