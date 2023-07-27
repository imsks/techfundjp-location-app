import { mapRange } from "../data"
import { MapRadiusDropdownProps } from "../interfaces"

const MapRadiusDropdown = ({
    selectedRadius,
    onChange
}: MapRadiusDropdownProps) => {
    return (
        <div className='map-dropdown'>
            <label htmlFor='radius'>Select Radius (meters):</label>
            <select
                id='radius'
                className='map-dropdown-item'
                value={selectedRadius}
                onChange={onChange}>
                {mapRange.map((radius) => (
                    <option value={radius} key={radius}>
                        {radius}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default MapRadiusDropdown
