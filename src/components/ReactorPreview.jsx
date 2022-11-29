import { Avatar, SpeedDial, SpeedDialAction } from "@mui/material"
import WifiOffIcon from '@mui/icons-material/WifiOff'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import AlignVerticalTopIcon from '@mui/icons-material/AlignVerticalTop'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import EvStationIcon from '@mui/icons-material/EvStation'
import TroubleshootIcon from '@mui/icons-material/Troubleshoot'
import { useEffect, useState } from "react"

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

    /**
     * Requests temperature data
     * of this reactor and updates
     * temperature state variable.
     */
    const updateTemperature = async () => {
        const rawData = await fetch(`https://nuclear.dacoder.io/reactors/temperature/${id}?apiKey=6cc0a3fa7141b32d`)
        const jsonData = await rawData.json()
        const temperature = jsonData.temperature

        setReactorData(prevData => ({
            ...prevData, 
            temperatureStatus: temperature.status,
            temperature: temperature.amount,
            temperatureUnit: temperature.unit
        }))
    }

    /**
     * Requests reactor state data
     * of this reactor and updates
     * state variable accordingly.
     */
    const updateReactorName = async () => {
        const rawData = await fetch(`https://nuclear.dacoder.io/reactors/reactor-state/${id}?apiKey=6cc0a3fa7141b32d`)
        const jsonData = await rawData.json()

        setReactorData(prevValue => ({
            ...prevValue,
            reactorState: jsonData.state
        }))
    }

    /**
     * Requests rod state of this
     * reactor and updates
     * state variables accordingly.
     */
    const updateRodData = async () => {
        const rawData = await fetch(`https://nuclear.dacoder.io/reactors/rod-state/${id}?apiKey=6cc0a3fa7141b32d`)
        const jsonData = await rawData.json()

        setReactorData(prevValue => ({
            ...prevValue,
            controlRodIn: jsonData.control_rods.in,
            controlRodOut: jsonData.control_rods.out
        }))
    }

    /**
     * Requests coolant state of this
     * reactor and updates
     * state variable accordingly.
     */
    const updateCoolantData = async () => {
        const rawData = await fetch(`https://nuclear.dacoder.io/reactors/coolant/${id}?apiKey=6cc0a3fa7141b32d`)
        const jsonData = await rawData.json()

        setReactorData(prevValue => ({
            ...prevValue,
            coolantState: jsonData.coolant
        }))
    }

    /**
     * Requests output information
     * of this reactor and updates
     * state variables accordingly.
     */
    const updateOutputData = async () => {
        const rawData = await fetch(`https://nuclear.dacoder.io/reactors/output/${id}?apiKey=6cc0a3fa7141b32d`)
        const jsonData = await rawData.json()

        setReactorData(prevValue => ({
            ...prevValue,
            output: jsonData.output.amount,
            outputUnit: jsonData.output.unit
        }))
    }

    /**
     * Requests fuel level information
     * of this reactor and updates
     * state variable accordingly.
     */
    const updateFuelLevelData = async () => {
        const rawData = await fetch(`https://nuclear.dacoder.io/reactors/fuel-level/${id}?apiKey=6cc0a3fa7141b32d`)
        const jsonData = await rawData.json()

        setReactorData(prevValue => ({
            ...prevValue,
            fuelLevel: jsonData.fuel.percentage
        }))
    }

    useEffect(() => {
        const interval = setInterval(async () => {
            await updateTemperature()
            await updateReactorName()
            await updateRodData()
            await updateCoolantData()
            await updateOutputData()
            await updateFuelLevelData()
        }, 250)

        return () => clearInterval(interval)
    }, [])

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
                <button className="indiv-emergency-shut-down-button">Emergency Shutdown</button>
                <button className="indiv-controlled-shut-down-button">Controlled Shutdown</button>
            </div>
            <SpeedDial
                ariaLabel="Reactor settings"
                icon={<TroubleshootIcon />}
                sx={{position: 'absolute', left: 270, top: 70}}
            >
                <SpeedDialAction
                    icon={<EvStationIcon />}
                    tooltipTitle={`Fuel percentage: ${reactorData.fuelLevel}%`}
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
                    tooltipTitle={`Rod state In: ${reactorData.controlRodIn} | Rod State Out: ${reactorData.controlRodOut}`}
                    tooltipPlacement="right"
                />
                <SpeedDialAction
                    icon={<ThermostatIcon />}
                    tooltipTitle={`Temperature: ${reactorData.temperature.toFixed(2)} ${reactorData.temperatureUnit}`}
                    tooltipPlacement="right"
                />
            </SpeedDial>
        </div>
    )
}

export default ReactorPreview