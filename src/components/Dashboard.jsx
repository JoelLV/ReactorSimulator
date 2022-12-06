import { useState, useEffect } from "react"
import Navbar from "./Navbar"
import ReactorPreview from "./ReactorPreview"

const Dashboard = () => {
    const [plantName, setPlantName] = useState("")
    const [reactors, setReactors] = useState([])

    /**
     * Fetch basic data of existing reactors
     * and plant name on mount and assign appropriate
     * state variables.
     */
    useEffect(() => {
        (async () => {
            const rawData = await fetch("https://nuclear.dacoder.io/reactors?apiKey=6cc0a3fa7141b32d")
            const jsonData = await rawData.json()
            setPlantName(jsonData.plant_name)
            setReactors(jsonData.reactors)
        })()
    }, [])

    return (
        <div className="reactors-container">
            {
                reactors.map(reactor => {
                    return <ReactorPreview key={reactor.id} id={reactor.id} name={reactor.name} />
                })
            }
        </div>
    )
}

export default Dashboard