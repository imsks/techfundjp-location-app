export interface Park {
    id: number
    name: string
    lat: number
    lng: number
}

export interface MapProps {
    parks: Park[]
}

export interface MapMarkerProps {
    location: [number, number]
    label: string
}

export interface MapRadiusDropdownProps {
    selectedRadius: number
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}
