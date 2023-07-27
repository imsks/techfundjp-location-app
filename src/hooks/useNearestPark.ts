import { useEffect, useState } from "react"
import { Park } from "../interfaces"
import { calculateDistance } from "../utils"
import useUserLocation from "./useUserLocation"

const useNearestPark = (parks: Park[]) => {
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

    return nearestPark
}

export default useNearestPark
