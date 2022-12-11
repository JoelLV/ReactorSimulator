import { useState, useEffect } from "react"
import getReactorData from "../helpers/RequestHelper"
import LineGraph from "./LineGraph"
import Navbar from "./Navbar"
import ReactorPreview from "./ReactorPreview"
import NameForm from "./NameForm"
import { Button, Skeleton, ThemeProvider } from "@mui/material"
import ButtonStyle from "../styles/ButtonStyle"
import ReactorViewTheme from "../styles/ReactorViewTheme"
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import { useRef } from "react"

const Dashboard = () => {
    const [plantName, setPlantName] = useState("")
    const [reactors, setReactors] = useState([])
    const [avgTemps, setAvgTemps] = useState([])
    const [logs, setLogs] = useState([])
    const [genCoolantOn, setGenCoolantOn] = useState(false)
    const [currMilliSec, setCurrMilliSec] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const intervalRef = useRef(null)
    const [loadingButtons, setLoadingButtons] = useState({
        genControlledShutdown: false,
        genEmergencyShutdown: false,
        genCoolant: false,
    })

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
        setIsLoading(false)
    }

    useEffect(() => {
        intervalRef.current = setInterval(fetchAndGrabData, 200)

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [])

    /**
     * Performs a controlled shutdown
     * for all reactors currently
     * present.
     */
    const handleAllControlledShutdown = async () => {
        setLoadingButtons(prevValues => ({
            ...prevValues,
            genControlledShutdown: true
        }))
        await Promise.all(reactors.map(async reactor => {
            try {
                if (reactor.reactorState !== "Emergency Shutdown") {
                    await fetch(`https://nuclear.dacoder.io/reactors/controlled-shutdown/${reactor.id}?apiKey=6cc0a3fa7141b32d`, {
                        method: "POST"
                    })
                }
            } catch (error) {
            }
        }))
        setLoadingButtons(prevValues => ({
            ...prevValues,
            genControlledShutdown: false
        }))
    }

    /**
     * Performs an emergency shutdown
     * for all reactors currently present.
     */
    const handleAllEmergencyShutdown = async () => {
        setLoadingButtons(prevValues => ({
            ...prevValues,
            genEmergencyShutdown: true
        }))
        await Promise.all(reactors.map(async reactor => {
            try {
                if (reactor.reactorState !== "Emergency Shutdown") {
                    await fetch(`https://nuclear.dacoder.io/reactors/emergency-shutdown/${reactor.id}?apiKey=6cc0a3fa7141b32d`, {
                        method: "POST"
                    })
                }
            } catch (error) {
            }
        }))
        setLoadingButtons(prevValues => ({
            ...prevValues,
            genEmergencyShutdown: false
        }))
    }

    /**
     * Toggles on/off all the
     * coolants for all reactors
     * currently present.
     */
    const handleAllToggleCoolant = async () => {
        setLoadingButtons(prevValues => ({
            ...prevValues,
            genCoolant: true
        }))
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
            }
        }))
        setGenCoolantOn(prevVal => !prevVal)
        setLoadingButtons(prevValues => ({
            ...prevValues,
            genCoolant: false
        }))
    }

    /**
     * Sets all state variables that are
     * related to reactor data to their
     * default values.
     */
    const resetData = async () => {
        clearInterval(intervalRef.current)
        setIsLoading(true)
        setPlantName("")
        setReactors([])
        setAvgTemps([])
        setLogs([])
        setGenCoolantOn(false)
        setCurrMilliSec(0)
    }

    /**
     * Restarts interval to start reading new data after
     * global reset.
     */
    const restartInterval = async () => {
        intervalRef.current = setInterval(fetchAndGrabData, 200)
    }

    return (
        <div>
            {
                isLoading ? (<Skeleton variant="rectangular" height="10vh" />) : (
                    <Navbar logs={logs} reSetter={resetData} intervalRestarter={restartInterval} />
                )
            }
            {
                isLoading ? (
                    <div style={{ display: "flex", justifyContent: "end", padding: "10px" }}>
                        <Skeleton variant="rectangular" height="10vh" width="50vh" />
                    </div>
                ) : (
                    <NameForm plantName={plantName} />
                )
            }
            <div className="graph-container">
                {
                    isLoading ? (<Skeleton height="500px" width="700px" />) : (
                        <div className="graph">
                            <LineGraph lineData={avgTemps} currMilliSec={currMilliSec} />
                        </div>
                    )
                }
            </div>
            <div className="gen-reactor-button-container">
                <ThemeProvider theme={ReactorViewTheme}>
                    {
                        isLoading ? (
                            <>
                                {
                                    [...Array(3)].map((_, index) => {
                                        return <Skeleton key={index} variant="rectangular" height="100px" width="300px" />
                                    })
                                }
                            </>
                        ) : (
                            <>
                                <Button
                                    sx={genActionsBtnStyles}
                                    color="controlled"
                                    variant="contained"
                                    onClick={handleAllControlledShutdown}
                                    disabled={loadingButtons.genControlledShutdown}
                                >
                                    {loadingButtons.genControlledShutdown ? (<HourglassBottomIcon />) : "Controlled Shutdown for all Reactors"}
                                </Button>
                                <Button
                                    sx={genActionsBtnStyles}
                                    color="emergency"
                                    variant="contained"
                                    onClick={handleAllEmergencyShutdown}
                                    disabled={loadingButtons.genEmergencyShutdown}
                                >
                                    {loadingButtons.genEmergencyShutdown ? (<HourglassBottomIcon />) : "Emergency Shutdown for all Reactors"}
                                </Button>
                                <Button
                                    sx={genActionsBtnStyles}
                                    color="coolant"
                                    variant="contained"
                                    onClick={handleAllToggleCoolant}
                                    disabled={loadingButtons.genCoolant}
                                >
                                    {loadingButtons.genCoolant ? (<HourglassBottomIcon />) : `Turn ${genCoolantOn ? "off" : "on"} all reactors' coolants`}
                                </Button>
                            </>
                        )
                    }
                </ThemeProvider>
            </div>
            <div className="reactors-container">
                {
                    isLoading ? (
                        <div style={{ display: "flex", justifyContent: "center", gap: "200px", margin: "20px", width: "100%" }}>
                            {
                                [...Array(3)].map((_, index) => {
                                    return <Skeleton key={index} variant="rectangular" height="350px" width="250px" />
                                })
                            }
                        </div>
                    ) : (
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
                    )
                }
            </div>
        </div>
    )
}

export default Dashboard