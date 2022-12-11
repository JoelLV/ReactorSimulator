import { Avatar, SpeedDial, SpeedDialAction, Button, ThemeProvider, Tooltip } from "@mui/material"
import WifiOffIcon from '@mui/icons-material/WifiOff'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import AlignVerticalTopIcon from '@mui/icons-material/AlignVerticalTop'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import EvStationIcon from '@mui/icons-material/EvStation'
import TroubleshootIcon from '@mui/icons-material/Troubleshoot'
import SettingsIcon from '@mui/icons-material/Settings'
import WifiIcon from '@mui/icons-material/Wifi'
import BuildIcon from '@mui/icons-material/Build'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import DangerousIcon from '@mui/icons-material/Dangerous'
import { useNavigate } from "react-router-dom"
import ButtonStyle from "../styles/ButtonStyle"
import ReactorViewTheme from "../styles/ReactorViewTheme"
import { useSnackbar } from "notistack"
import { useState } from "react"

const ReactorPreview = ({ id, name, tempStatus, temp, tempUnit, reactorState, controlRodIn, controlRodOut, coolantState, output, outputUnit, fuelLevel }) => {
    const navigate = useNavigate()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [loadingButtons, setLoadingButtons] = useState({
        emergencyButton: false,
        controlledButton: false,
    })

    /**
     * Notifies server to perform an
     * emergency shut down on this reactor.
     */
    const handleEmergencyShutDown = async () => {
        setLoadingButtons(prevValues => ({
            ...prevValues,
            emergencyButton: true
        }))
        try {
            const response = await fetch(`https://nuclear.dacoder.io/reactors/emergency-shutdown/${id}?apiKey=6cc0a3fa7141b32d`, {
                method: 'POST'
            })

            if (!response.ok) {
                const errorMessage = await response.json()
                enqueueSnackbar(errorMessage.message, {
                    preventDuplicate: true
                })
            }
        } catch (error) {
        } finally {
            setLoadingButtons(prevValues => ({
                ...prevValues,
                emergencyButton: false
            }))
        }
    }

    /**
     * Notifies server to perform a
     * controlled shut down on this reactor.
     */
    const handleControlledShutDown = async () => {
        setLoadingButtons(prevValues => ({
            ...prevValues,
            controlledButton: true
        }))
        try {
            const response = await fetch(`https://nuclear.dacoder.io/reactors/controlled-shutdown/${id}?apiKey=6cc0a3fa7141b32d`, {
                method: 'POST'
            })

            if (!response.ok) {
                const errorMessage = await response.json()
                enqueueSnackbar(errorMessage.message, {
                    preventDuplicate: true
                })
            }
        } catch (error) {
        } finally {
            setLoadingButtons(prevValues => ({
                ...prevValues,
                controlledButton: false
            }))
        }
    }

    /**
     * Returns a string representing the appropriate
     * color to display in the avatar according to
     * the current reactor state.
     * 
     * @returns string Color chosen according to given reactor status.
     */
    const getReactorStatusColor = () => {
        if (reactorState === "Active") {
            return "lightgreen"
        } else if (reactorState === "Offline") {
            return "black"
        } else if (reactorState === "Maintenance") {
            return "#FFA500"
        } else {
            return "#FF6663"
        }
    }

    /**
     * Returns a Material UI icon
     * according to the current
     * reactor status.
     */
    const getReactorStatusIcon = () => {
        if (reactorState === "Active") {
            return (<WifiIcon />)
        } else if (reactorState === "Offline") {
            return (<WifiOffIcon />)
        } else if (reactorState === "Maintenance") {
            return (<BuildIcon />)
        } else {
            return (<DangerousIcon />)
        }
    }

    /**
     * Returns a string representing
     * the color to display for the
     * temperature speed dial action.
     * 
     * @returns string Color as string
     */
    const getTemperatureStatusColor = () => {
        if (tempStatus === "Safe") {
            return "reactorOn.main"
        } else if (tempStatus === "Caution") {
            return "refuel.main"
        } else if (tempStatus === "Danger") {
            return "emergency.main"
        } else {
            return "purple"
        }
    }

    /**
     * Returns a string representing
     * the color to display for the
     * coolant speed dial action.
     * 
     * @returns string Color as string
     */
    const getCoolantStatusColor = () => {
        return coolantState === "on" ? "reactorOn.main" : "emergency.main"
    }

    /**
     * Returns a string representing
     * the color to display for the
     * fuel level speed dial action.
     * 
     * @returns string Color as string
     */
    const getFuelLevelColor = () => {
        if (fuelLevel >= 50) {
            return "reactorOn.main"
        } else if (fuelLevel > 0 && fuelLevel < 50) {
            return "refuel.main"
        } else {
            return "emergency.main"
        }
    }

    /**
     * Returns a string representing
     * the color to display for the
     * speed dial circle. If there is
     * a warning either in fuel level
     * or temperature level, circle
     * is painted to orange. If
     * fuel level is empty or
     * the temperature status is
     * danger or meltdown, the circle is 
     * painted red. Otherwise, the
     * circle is green.
     * 
     * @returns string Color as string
     */
    const getGenSpeedDialColor = () => {
        if (fuelLevel <= 0 ||
            tempStatus === "Danger" ||
            tempStatus === "Meltdown"
        ) {
            return "emergency.main"
        } else if (fuelLevel > 0 && fuelLevel < 50 ||
            tempStatus === "Caution"
        ) {
            return "refuel.main"
        } else {
            return "reactorOn.main"
        }
    }

    return (
        <div className="reactor-preview-container">
            <ThemeProvider theme={ReactorViewTheme}>
                <div className="reactor-preview-body">
                    <div className="reactor-preview-header">
                        <Tooltip title={reactorState}>
                            <Avatar sx={{ bgcolor: getReactorStatusColor() }}>
                                {getReactorStatusIcon()}
                            </Avatar>
                        </Tooltip>
                        <p>{name}</p>
                    </div>
                    <img className="reactor-preview-image" src="reactor.png" alt="Reactor image" />
                    <Button
                        onClick={handleEmergencyShutDown}
                        sx={ButtonStyle}
                        variant="contained"
                        color="emergency"
                        disabled={loadingButtons.emergencyButton}
                    >
                        {loadingButtons.emergencyButton ? <HourglassBottomIcon /> : "Emergency Shutdown"}
                    </Button>
                    <Button
                        onClick={handleControlledShutDown}
                        sx={ButtonStyle}
                        variant="contained"
                        color="controlled"
                    >
                        {loadingButtons.controlledButton ? <HourglassBottomIcon /> : "Controlled Shutdown"}
                    </Button>
                </div>
                <SpeedDial
                    ariaLabel="Reactor settings"
                    icon={<TroubleshootIcon />}
                    sx={{ position: 'absolute', left: 320, top: 70, boxShadow: 0 }}
                    FabProps={{
                        sx: {
                            bgcolor: getGenSpeedDialColor(),
                            '&:hover': {
                                bgcolor: getGenSpeedDialColor(),
                            }
                        }
                    }}
                >
                    <SpeedDialAction
                        icon={<EvStationIcon />}
                        tooltipTitle={`Fuel percentage: ${fuelLevel.toFixed(2)}%`}
                        tooltipPlacement="right"
                        sx={{
                            bgcolor: getFuelLevelColor(),
                            '&:hover': {
                                bgcolor: getFuelLevelColor(),
                            }
                        }}
                    />
                    <SpeedDialAction
                        icon={<ElectricBoltIcon />}
                        tooltipTitle={`Output: ${output} ${outputUnit}`}
                        tooltipPlacement="right"
                        sx={{
                            '&:hover': {
                                bgcolor: "white"
                            }
                        }}
                    />
                    <SpeedDialAction
                        icon={<AcUnitIcon />}
                        tooltipTitle={`Coolant state: ${coolantState}`}
                        tooltipPlacement="right"
                        sx={{
                            bgcolor: getCoolantStatusColor(),
                            '&:hover': {
                                bgcolor: getCoolantStatusColor(),
                            }
                        }}
                    />
                    <SpeedDialAction
                        icon={<AlignVerticalTopIcon />}
                        tooltipTitle={`Rods in: ${controlRodIn} | Rods out: ${controlRodOut}`}
                        tooltipPlacement="right"
                        sx={{
                            '&:hover': {
                                bgcolor: "white"
                            }
                        }}
                    />
                    <SpeedDialAction
                        icon={<ThermostatIcon />}
                        tooltipTitle={`Temperature: ${temp.toFixed(2)} ${tempUnit}`}
                        tooltipPlacement="right"
                        sx={{
                            bgcolor: getTemperatureStatusColor(),
                            '&:hover': {
                                bgcolor: getTemperatureStatusColor(),
                            }
                        }}
                    />
                </SpeedDial>
                <Tooltip title="Settings">
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
                </Tooltip>
            </ThemeProvider>
        </div>
    )
}

export default ReactorPreview