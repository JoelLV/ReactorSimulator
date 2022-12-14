import { createTheme } from "@mui/material"

const ReactorViewTheme = createTheme({
    typography: {
        h3: {
            fontSize: "2.4em"
        },
        h4: {
            fontSize: "1.0em",
            '@media (max-width: 850px)': {
                fontSize: "1.0em"
            }
        },
        h6: {
            fontSize: "1.0em",
            '@media (max-width: 850px)': {
                fontSize: "1.0em"
            }
        },
        fontFamily: "Roboto Mono",
    },
    palette: {
        emergency: {
            main: '#FF6663',
            contrastText: 'white'
        },
        controlled: {
            main: '#E0FF4F',
            contrastText: '#0B3954'
        },
        refuel: {
            main: '#FFA500',
            contrastText: 'white'
        },
        coolant: {
            main: '#BFD7EA',
            contrastText: '#0B3954'
        },
        reactorOff: {
            main: 'red',
            contrastText: 'white'
        },
        reactorOn: {
            main: 'lightGreen',
            contrastText: 'white'
        }
    }
})

export default ReactorViewTheme