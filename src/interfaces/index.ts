export interface Park {
    id: number
    name: string
    lat: number
    lng: number
}

export interface MapProps {
    parks: Park[]
}
