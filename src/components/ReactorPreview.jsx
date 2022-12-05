import { Avatar, SpeedDial, SpeedDialAction, Button, ThemeProvider } from "@mui/material"
import WifiOffIcon from '@mui/icons-material/WifiOff'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import AlignVerticalTopIcon from '@mui/icons-material/AlignVerticalTop'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import EvStationIcon from '@mui/icons-material/EvStation'
import TroubleshootIcon from '@mui/icons-material/Troubleshoot'
import SettingsIcon from '@mui/icons-material/Settings'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import getReactorData from "../helpers/RequestHelper"
import ButtonStyle from "../styles/ButtonStyle"
import ReactorViewTheme from "../styles/ReactorViewTheme"

const ReactorPreview = ({ id, name }) => {
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
    const navigate = useNavigate()

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
            } catch (error) {
            }
        }, 200)

        return () => clearInterval(interval)
    }, [])

    /**
     * Notifies server to perform an
     * emergency shut down on this reactor.
     */
    const handleEmergencyShutDown = async () => {
        try {
            await fetch(`https://nuclear.dacoder.io/reactors/emergency-shutdown/${id}?apiKey=6cc0a3fa7141b32d`, {
                method: 'POST'
            })
        } catch (error) {
        }
    }

    /**
     * Notifies server to perform a
     * controlled shut down on this reactor.
     */
    const handleControlledShutDown = async () => {
        try {
            await fetch(`https://nuclear.dacoder.io/reactors/controlled-shutdown/${id}?apiKey=6cc0a3fa7141b32d`, {
                method: 'POST'
            })
        } catch (error) {
        }
    }

    return (
        <div className="reactor-preview-container">
            <div className="reactor-preview-body">
                <div className="reactor-preview-header">
                    <Avatar sx={{ bgcolor: "#FF6663"}}>
                        <WifiOffIcon />
                    </Avatar>
                    <p>{name}</p>
                </div>
                <img className="reactor-preview-image" src="reactor.png" alt="Reactor image" />
                <ThemeProvider theme={ReactorViewTheme}>
                    <Button 
                        onClick={handleEmergencyShutDown}
                        sx={ButtonStyle}
                        variant="contained"
                        color="emergency"
                    >
                        Emergency Shutdown
                    </Button>
                    <Button
                        onClick={handleControlledShutDown}
                        sx={ButtonStyle}
                        variant="contained"
                        color="controlled"
                    >
                        Controlled Shutdown
                    </Button>
                </ThemeProvider>
            </div>
            <SpeedDial
                ariaLabel="Reactor settings"
                icon={<TroubleshootIcon />}
                sx={{position: 'absolute', left: 320, top: 70, boxShadow: 0}}
            >
                <SpeedDialAction
                    icon={<EvStationIcon />}
                    tooltipTitle={`Fuel percentage: ${reactorData.fuelLevel.toFixed(2)}%`}
                    tooltipPlacement="right"
                />
                <SpeedDialAction
                    icon={<ElectricBoltIcon />}
                    tooltipTitle={`Output: ${reactorData.output} ${reactorData.outputUnit}`}
                    tooltipPlacement="right"
                />
                <SpeedDialAction
                    icon={<AcUnitIcon />}
                    tooltipTitle={`Coolant state: ${reactorData.coolantState}`}
                    tooltipPlacement="right"
                />
                <SpeedDialAction
                    icon={<AlignVerticalTopIcon />}
                    tooltipTitle={`Rods in: ${reactorData.controlRodIn} | Rods out: ${reactorData.controlRodOut}`}
                    tooltipPlacement="right"
                />
                <SpeedDialAction
                    icon={<ThermostatIcon />}
                    tooltipTitle={`Temperature: ${reactorData.temperature.toFixed(2)} ${reactorData.temperatureUnit}`}
                    tooltipPlacement="right"
                />
            </SpeedDial>
            <Button
                color="primary" 
                variant="contained"
                sx={{
                    position: "absolute", 
                    borderRadius: 50, 
                    left: 320, 
                    top: 430, 
                    maxWidth: 56, 
                    minWidth: 56, 
                    maxHeight: 56, 
                    minHeight: 56,
                }}
                onClick={() => navigate(`/${id}`)}
            >
                <SettingsIcon />
            </Button>
        </div>
    )
}

export default ReactorPreview