import { useState, useEffect } from "react"
import LineGraph from "./LineGraph"
import ReactorPreview from "./ReactorPreview"

const Dashboard = () => {
    const [plantName, setPlantName] = useState("")
    const [reactors, setReactors] = useState([])
    const [avgTemps, setAvgTemps] = useState([])

    /**
     * Fetch basic data of existing reactors
     * and plant name on mount and assign appropriate
     * state variables.
     */

    //Had to change to fetch and update the data
    const fetchAndGrabData = async () => {
        const rawData = await fetch("https://nuclear.dacoder.io/reactors?apiKey=6cc0a3fa7141b32d")
        const jsonData = await rawData.json()

        jsonData.reactors = await Promise.all(jsonData.reactors.map(async reactor => {
            const rawTempData = await fetch(`https://nuclear.dacoder.io/reactors/temperature/${reactor.id}?apiKey=6cc0a3fa7141b32d`)
            const jsonTempData = await rawTempData.json()

            return {
                ...reactor,
                temperature: jsonTempData.temperature
            }
        }))

        setAvgTemps(prevAvgTemps => [...prevAvgTemps, jsonData.reactors.map(reactor => reactor.temperature.amount).reduce((accumulator, value) => accumulator + value, 0) / jsonData.reactors.length].slice(-300)) // grab last 300 to only get 5 minutes worth of data
        setPlantName(jsonData.plant_name)
        setReactors(jsonData.reactors)
    }

    useEffect(() => {
        const intervalId = setInterval(fetchAndGrabData, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    return (
        <div>
            <div style={{ width: "50%" }}>
                <LineGraph lineData={avgTemps} />
            </div>
            <div className="reactors-container">
                {
                    reactors.map(reactor => {
                        return <ReactorPreview key={reactor.id} id={reactor.id} name={reactor.name} />
                    })
                }
            </div>
        </div>
    )
}

export default Dashboard