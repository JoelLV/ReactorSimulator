import { useState, useEffect } from "react"
import getReactorData from "../helpers/RequestHelper"
import LineGraph from "./LineGraph"
import Navbar from "./Navbar"
import ReactorPreview from "./ReactorPreview"
import NameForm from "./NameForm"
import { Button, ThemeProvider } from "@mui/material"
import ButtonStyle from "../styles/ButtonStyle"
import ReactorViewTheme from "../styles/ReactorViewTheme"

const Dashboard = () => {
    const [plantName, setPlantName] = useState("")
    const [reactors, setReactors] = useState([])
    const [avgTemps, setAvgTemps] = useState([])
    const [logs, setLogs] = useState([])
    const [genCoolantOn, setGenCoolantOn] = useState(false)
    const [currMilliSec, setCurrMilliSec] = useState(0)

    const genActionsBtnStyles = {
        ...ButtonStyle,
        minWidth: "300px",
        maxWidth: "300px",
        minHeight: "100px",
        maxHeight: "100px",
        fontSize: "20px"
    }
    /**
     * Fetch basic data of existing reactors
     * and plant name on mount and assign appropriate
     * state variables.
     */
    const fetchAndGrabData = async () => {
        const rawData = await fetch("https://nuclear.dacoder.io/reactors?apiKey=6cc0a3fa7141b32d")
        const jsonData = await rawData.json()

        jsonData.reactors = await Promise.all(jsonData.reactors.map(async reactor => {
            const reactorData = await getReactorData(reactor.id)
            return {
                ...reactorData,
                id: reactor.id,
                name: reactor.name
            }
        }))

        const rawLogs = await fetch("https://nuclear.dacoder.io/reactors/logs?apiKey=6cc0a3fa7141b32d")
        const jsonLogs = await rawLogs.json()
        const stringLogs = jsonLogs.flatMap(log => {
            return Object.keys(log).flatMap(key => {
                return log[key]
            })
        })

        // grab last 1500 to only get 5 minutes worth of data
        setAvgTemps(prevAvgTemps => [
            ...prevAvgTemps,
            jsonData.reactors.map(reactor => reactor.temperature)
                .reduce((accumulator, value) => accumulator + value, 0) / jsonData.reactors.length
        ].slice(-1500))
        setCurrMilliSec(prevTime => prevTime + 200)
        setLogs(stringLogs)
        setPlantName(jsonData.plant_name)
        setReactors(jsonData.reactors)
    }

    useEffect(() => {
        const intervalId = setInterval(fetchAndGrabData, 200)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    /**
     * Performs a controlled shutdown
     * for all reactors currently
     * present.
     */
    const handleAllControlledShutdown = async () => {
        await Promise.all(reactors.map(async reactor => {
            try {
                if (reactor.reactorState !== "Emergency Shutdown") {
                    await fetch(`https://nuclear.dacoder.io/reactors/controlled-shutdown/${reactor.id}?apiKey=6cc0a3fa7141b32d`, {
                        method: "POST"
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }))
    }

    /**
     * Performs an emergency shutdown
     * for all reactors currently present.
     */
    const handleAllEmergencyShutdown = async () => {
        await Promise.all(reactors.map(async reactor => {
            try {
                if (reactor.reactorState !== "Emergency Shutdown") {
                    await fetch(`https://nuclear.dacoder.io/reactors/emergency-shutdown/${reactor.id}?apiKey=6cc0a3fa7141b32d`, {
                        method: "POST"
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }))
    }

    /**
     * Toggles on/off all the
     * coolants for all reactors
     * currently present.
     */
    const handleAllToggleCoolant = async () => {
        await Promise.all(reactors.map(async reactor => {
            try {
                if (reactor.reactorState !== "Emergency Shutdown" &&
                    reactor.reactorState !== "Offline" &&
                    reactor.reactorState !== "Maintenance"
                ) {
                    if ((genCoolantOn && reactor.coolantState !== "off") ||
                        (!genCoolantOn && reactor.coolantState !== "on")
                    ) {
                        await fetch(`https://nuclear.dacoder.io/reactors/coolant/${reactor.id}?apiKey=6cc0a3fa7141b32d`, {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                coolant: genCoolantOn ? "off" : "on"
                            })
                        })
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }))
        setGenCoolantOn(prevVal => !prevVal)
    }

    return (
        <div>
            <Navbar logs={logs} />
            <div>
                <h1 id="powerName">Enter Power Plant Name</h1>
                <NameForm />
            </div>
            <div style={{ width: "50%" }}>
                <LineGraph lineData={avgTemps} currMilliSec={currMilliSec} />
            </div>
            <div style={{ display: "flex", gap: "100px", justifyContent: "center" }}>
                <ThemeProvider theme={ReactorViewTheme}>
                    <Button
                        sx={genActionsBtnStyles}
                        color="controlled"
                        variant="contained"
                        onClick={handleAllControlledShutdown}
                    >
                        Controlled Shutdown for all Reactors
                    </Button>
                    <Button
                        sx={genActionsBtnStyles}
                        color="emergency"
                        variant="contained"
                        onClick={handleAllEmergencyShutdown}
                    >
                        Emergency Shutdown for all Reactors
                    </Button>
                    <Button
                        sx={genActionsBtnStyles}
                        color="coolant"
                        variant="contained"
                        onClick={handleAllToggleCoolant}
                    >
                        Turn {genCoolantOn ? "off" : "on"} all reactors' coolants
                    </Button>
                </ThemeProvider>
            </div>
            <div className="reactors-container">
                {
                    reactors.map(reactor => {
                        return <ReactorPreview
                            key={reactor.id}
                            id={reactor.id}
                            name={reactor.name}
                            tempStatus={reactor.temperatureStatus}
                            temp={reactor.temperature}
                            tempUnit={reactor.temperatureUnit}
                            reactorState={reactor.reactorState}
                            controlRodIn={reactor.controlRodIn}
                            controlRodOut={reactor.controlRodOut}
                            coolantState={reactor.coolantState}
                            output={reactor.output}
                            outputUnit={reactor.outputUnit}
                            fuelLevel={reactor.fuelLevel}
                        />
                    })
                }
            </div>
        </div>
    )
}

export default Dashboard