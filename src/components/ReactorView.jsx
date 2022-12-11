import { Button, Card, CardContent, ThemeProvider, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import getReactorData from "../helpers/RequestHelper"
import ButtonStyle from "../styles/ButtonStyle"
import ReactorViewTheme from "../styles/ReactorViewTheme"
import AlignVerticalTopIcon from '@mui/icons-material/AlignVerticalTop'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import EvStationIcon from '@mui/icons-material/EvStation'
import DangerousIcon from '@mui/icons-material/Dangerous'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import { useSnackbar } from "notistack"
import LineGraph from "./LineGraph"
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import NameForm from "./NameForm"

const ReactorView = () => {
    const navigate = useNavigate()
    const [reactorData, setReactorData] = useState({
        temperatureStatus: "",
        temperature: 0.0,
        temperatureUnit: "",
        reactorState: "",
        controlRodIn: 0,
        controlRodOut: 0,
        coolantState: "",
        output: 0,
        outputUnit: "",
        fuelLevel: 0,
    })
    const [tempData, setTempData] = useState([])
    const { id } = useParams()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [currMilliSec, setCurrMilliSec] = useState(0)

    /**
     * Returns true if reactor state is
     * on maintenance mode or offline.
     * 
     * @return bool
     */
    const isOffline = () => {
        return reactorData.reactorState === "Offline" || reactorData.reactorState === "Maintenance"
    }

    /**
     * Returns true if current
     * reactor is in emergency shutdown.
     * 
     * @returns bool
     */
    const inEmergencyShutdown = () => {
        return reactorData.reactorState === "Emergency Shutdown"
    }

    /**
     * Returns a string that represents the
     * color that needs to be displayed depending
     * on the state of the reactor.
     */
    const getPowerButtonColor = () => {
        if (reactorData.reactorState === "Active") {
            return "reactorOn"
        } else if (reactorData.reactorState === "Offline") {
            return "reactorOff"
        } else {
            return "reactorOff"
        }
    }

    /**
     * Starts requesting constantly
     * to the server for information
     * regarding this reactor and
     * updates state data accordingly.
     */
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const data = await getReactorData(id)
                setReactorData(data)
                setCurrMilliSec(prevMilliSec => prevMilliSec + 200)
                setTempData(prevTempData => [...prevTempData, data.temperature].slice(-1500))
            } catch (error) {
            }
        }, 200)

        return () => clearInterval(interval)
    }, [])

    /**
     * Requests server to start this
     * reactor or turn off reactor.
     */
    const requestReactorStateChange = async () => {
        try {
            if (reactorData.reactorState === "Active") {
                await fetch(`https://nuclear.dacoder.io/reactors/controlled-shutdown/${id}?apiKey=6cc0a3fa7141b32d`, {
                    method: "POST"
                })
            } else if (reactorData.reactorState === "Offline" ||
                reactorData.reactorState === "Maintenance"
            ) {
                await fetch(`https://nuclear.dacoder.io/reactors/start-reactor/${id}?apiKey=6cc0a3fa7141b32d`, {
                    method: "POST"
                })
            }
        } catch (error) {
        }
    }

    /**
     * Toggles coolant state of
     * reactor by requesting
     * appropriate POST
     * request to server.
     */
    const toggleCoolantState = async () => {
        try {
            await fetch(`https://nuclear.dacoder.io/reactors/coolant/${id}?apiKey=6cc0a3fa7141b32d`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    coolant: reactorData.coolantState === "on" ? "off" : "on"
                })
            })
        } catch (error) {
        }
    }

    /**
     * Handles all requests needed to
     * refuel reactor. Sets reactor
     * on maintaince mode if it
     * isn't yet and then
     * refuels reactor.
     */
    const refuelReactor = async () => {
        try {
            await fetch(`https://nuclear.dacoder.io/reactors/maintenance/${id}?apiKey=6cc0a3fa7141b32d`, {
                method: "POST"
            })
            await fetch(`https://nuclear.dacoder.io/reactors/refuel/${id}?apiKey=6cc0a3fa7141b32d`, {
                method: "POST"
            })
        } catch (error) {
        }
    }

    /**
     * Requests server to raise or drop
     * 50 rods. If there are
     * less than 50 rods lowered or raised,
     * the function should change
     * the remaining rods.
     * 
     * @param rodsToChange int number of rods to be raised or lowered.
     * @param action string name of controller needed to perform appropriate api call.
     */
    const changeRods = async (rodsToChange, action) => {
        let rodsChanged = rodsToChange
        for (let i = 0; i < 50; i++) {
            try {
                await fetch(`https://nuclear.dacoder.io/reactors/${action}/${id}?apiKey=6cc0a3fa7141b32d`, {
                    method: "POST"
                })
                if (--rodsChanged <= 0) {
                    break
                }
            } catch (error) {
                break
            }
        }
    }

    /**
     * Event triggered whenever the
     * power button is clicked.
     * Sends a POST request to the
     * server to request to turn
     * this reactor on or off.
     */
    const handlePowerButtonClicked = () => {
        if (reactorData.fuelLevel <= 0 && reactorData.reactorState === "Offline") {
            enqueueSnackbar('Please refuel reactor first before starting it up.', {
                preventDuplicate: true,
            })
        } else {
            requestReactorStateChange()
        }
    }

    /**
     * Event triggered whenever the
     * emergency button is clicked.
     * Sends a POST request to
     * the server to request an
     * emergency shutdown.
     */
    const handleEmergencyButtonClicked = async () => {
        try {
            await fetch(`https://nuclear.dacoder.io/reactors/emergency-shutdown/${id}?apiKey=6cc0a3fa7141b32d`, {
                method: "POST"
            })
        } catch (error) {
        }
    }

    /**
     * Event triggered whenever the
     * coolant toggle button is clicked.
     * Requests server to turn on/off
     * coolant.
     */
    const handleCoolantButtonClicked = () => {
        toggleCoolantState()
    }

    /**
     * Event triggered whenever the
     * refuel button is clicked. Requests
     * server to put reactor on maintaince
     * mode and when approved, sends
     * another request to the server
     * to refuel reactor.
     */
    const handleRefuelButtonClicked = () => {
        refuelReactor()
    }

    /**
     * Event triggered whenever the
     * raise rod button or drop rod
     * button is clicked. If the current
     * reactor state is active, it raises
     * or lowers 50 rods depending on the
     * action passed as parameter. Otherwise,
     * an error message is displayed as a
     * snackbar message.
     * 
     * @param action string action needed to execute appropriate api call
     */
    const handleRodChangeButtonClicked = (action) => {
        changeRods(action === "raise-rod" ? reactorData.controlRodIn : reactorData.controlRodOut, action)
    }

    const changeName = async ({target}) => {
        const {value} = target
        try {
            await fetch(`https://nuclear.dacoder.io/reactors/set-reactor-name/${id}?apiKey=6cc0a3fa7141b32d`, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name
                })
            })
        } catch (error) {
        }
    }

    return (
        <ThemeProvider theme={ReactorViewTheme}>
            <NameForm />
            <Button
                color="primary" 
                variant="contained"
                sx={{
                    position: "absolute", 
                    borderRadius: 50, 
                    left: 120,
                    top: 20,
                    maxWidth: 32,
                    minWidth: 32,
                    maxHeight: 32,
                    minHeight: 32,
                }}
                onClick={() => navigate(`/`)}
            >
                <ArrowCircleLeftOutlinedIcon />
            </Button>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "100px" }}>
                <div className="graph">
                    <LineGraph lineData={tempData} currMilliSec={currMilliSec} />
                </div>
                <div className="reactor-view-container">
                    <div className="reactor-view-btn-container">
                        <Button 
                            variant="contained"
                            sx={ButtonStyle}
                            color="refuel"
                            onClick={handleRefuelButtonClicked}
                            disabled={inEmergencyShutdown()}
                        >
                            Refuel Reactor <EvStationIcon />
                        </Button>
                        <Button 
                            variant="contained"
                            sx={ButtonStyle}
                            color="emergency"
                            onClick={handleEmergencyButtonClicked}
                            disabled={inEmergencyShutdown()}
                        >
                            Emergency Shutdown <DangerousIcon />
                        </Button>
                        <Button 
                            variant="contained"
                            sx={ButtonStyle}
                            color="coolant"
                            onClick={handleCoolantButtonClicked}
                            disabled={isOffline() || inEmergencyShutdown()}
                        >
                            Turn {reactorData.coolantState === "on" ? "off" : "on"} Coolant <AcUnitIcon />
                        </Button>
                        <Button
                            variant="contained"
                            sx={ButtonStyle}
                            onClick={() => handleRodChangeButtonClicked("raise-rod")}
                            disabled={isOffline() || inEmergencyShutdown()}
                        >
                            Raise Rods <AlignVerticalTopIcon />
                        </Button>
                        <Button 
                            variant="contained"
                            sx={ButtonStyle}
                            onClick={() => handleRodChangeButtonClicked("drop-rod")}
                            disabled={isOffline() || inEmergencyShutdown()}
                        >
                            Drop Rods <AlignVerticalTopIcon />
                        </Button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <img className="reactor-preview-image" src="reactor.png" />
                        <div style={{ display: "flex", gap: "10px" }}>
                            <p>Reactor State: {reactorData.reactorState}</p>
                            <Tooltip title={reactorData.reactorState === "Active" ? "Perform controlled shutdown" : "Activate reactor"}>
                                <Button
                                    sx={{
                                        ...ButtonStyle,
                                        minWidth: "50px",
                                        maxWidth: "50px"
                                    }}
                                    variant="contained"
                                    color={getPowerButtonColor()}
                                    onClick={handlePowerButtonClicked}
                                    disabled={inEmergencyShutdown()}
                                >
                                    <PowerSettingsNewIcon />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h4">
                                Reactor Information
                            </Typography>
                            <hr />
                            <div style={{ display: "flex" }}>
                                <div>
                                    <Typography variant="h6">
                                        Coolant State:
                                    </Typography>
                                    <Typography variant="h6">
                                        Temperature:
                                    </Typography>
                                    <Typography variant="h6">
                                        Temperature Status:
                                    </Typography>
                                    <Typography variant="h6">
                                        Fuel Level:
                                    </Typography>
                                    <Typography variant="h6">
                                        Output:
                                    </Typography>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "end" }}>
                                    <Typography variant="h6">
                                        {reactorData.coolantState}
                                    </Typography>
                                    <Typography variant="h6">
                                        {reactorData.temperature.toFixed(2)} {reactorData.temperatureUnit}
                                    </Typography>
                                    <Typography variant="h6">
                                        {reactorData.temperatureStatus}
                                    </Typography>
                                    <Typography variant="h6">
                                        {reactorData.fuelLevel.toFixed(2)}%
                                    </Typography>
                                    <Typography variant="h6">
                                        {reactorData.output.toFixed(2)} {reactorData.outputUnit}
                                    </Typography>
                                </div>
                            </div>
                            <Typography variant="h6">
                                Rod States:
                            </Typography>
                            <ul>
                                <li>
                                    Number of Rods in: {reactorData.controlRodIn}
                                </li>
                                <li>
                                    Number of Rods out: {reactorData.controlRodOut}
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default ReactorView