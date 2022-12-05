/**
 * Requests temperature data
 * of this reactor and returns
 * result.
 */
const updateTemperature = async (id) => {
    const rawData = await fetch(`https://nuclear.dacoder.io/reactors/temperature/${id}?apiKey=6cc0a3fa7141b32d`)
    const jsonData = await rawData.json()
    const temperature = jsonData.temperature

    return {
        temperatureStatus: temperature.status,
        temperature: temperature.amount,
        temperatureUnit: temperature.unit
    }
}

/**
 * Requests reactor state data
 * of this reactor and returns
 * result.
 */
const updateReactorName = async (id) => {
    const rawData = await fetch(`https://nuclear.dacoder.io/reactors/reactor-state/${id}?apiKey=6cc0a3fa7141b32d`)
    const jsonData = await rawData.json()

    return {
        reactorState: jsonData.state
    }
}

/**
 * Requests rod state of this
 * reactor and returns result.
 */
const updateRodData = async (id) => {
    const rawData = await fetch(`https://nuclear.dacoder.io/reactors/rod-state/${id}?apiKey=6cc0a3fa7141b32d`)
    const jsonData = await rawData.json()

    return {
        controlRodIn: jsonData.control_rods.in,
        controlRodOut: jsonData.control_rods.out
    }
}

/**
 * Requests coolant state of this
 * reactor and returns result.
 */
const updateCoolantData = async (id) => {
    const rawData = await fetch(`https://nuclear.dacoder.io/reactors/coolant/${id}?apiKey=6cc0a3fa7141b32d`)
    const jsonData = await rawData.json()

    return {
        coolantState: jsonData.coolant
    }
}

/**
 * Requests output information
 * of this reactor and returns
 * result.
 */
const updateOutputData = async (id) => {
    const rawData = await fetch(`https://nuclear.dacoder.io/reactors/output/${id}?apiKey=6cc0a3fa7141b32d`)
    const jsonData = await rawData.json()

    return {
        output: jsonData.output.amount,
        outputUnit: jsonData.output.unit
    }
}

/**
 * Requests fuel level information
 * of this reactor and returns result.
 */
const updateFuelLevelData = async (id) => {
    const rawData = await fetch(`https://nuclear.dacoder.io/reactors/fuel-level/${id}?apiKey=6cc0a3fa7141b32d`)
    const jsonData = await rawData.json()
    return {
        fuelLevel: jsonData.fuel.percentage
    }
}

const getReactorData = async (id) => {
    const fuelLevel = await updateFuelLevelData(id)
    const output = await updateOutputData(id)
    const coolantData = await updateCoolantData(id)
    const rodData = await updateRodData(id)
    const reactorName = await updateReactorName(id)
    const temperature = await updateTemperature(id)
    return {
        ...fuelLevel,
        ...output,
        ...coolantData,
        ...rodData,
        ...reactorName,
        ...temperature
    }
}

export default getReactorData