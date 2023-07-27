import Map from "./Components/Map"
import "./App.css"
import { parks } from "./data"

const App = () => {
    return (
        <div className='map'>
            <h1>Location-Based App</h1>
            <Map parks={parks} />
        </div>
    )
}

export default App
