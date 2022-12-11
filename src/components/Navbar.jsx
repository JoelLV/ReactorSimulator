import { Button, SwipeableDrawer, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { useState } from 'react';

const Navbar = ({ logs, reSetter, intervalRestarter }) => {
    const [mobileOpen, setMobileOpen] = useState(false)

    /**
     * Resets all reactors that were
     * passed as a prop.
     */
    const resetReactors = async () => {
        reSetter()
        await fetch(`https://nuclear.dacoder.io/reactors/reset?apiKey=6cc0a3fa7141b32d`, {
            method: "POST"
        })
        intervalRestarter()
    }

    return (
        <Box sx={{ display: 'flex', }}>
            <AppBar>
                <Toolbar>
                    <Button sx={{ color: '#fff' }} onClick={resetReactors}>
                        Global Reset
                    </Button>
                    <Button sx={{ color: '#fff', marginLeft: "auto" }} onClick={() => { setMobileOpen(true) }}>
                        Open Log
                    </Button>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer
                anchor={"bottom"}
                open={mobileOpen}
                disableScrollLock={true}
                PaperProps={{
                    sx: {
                        maxHeight: "40vh",
                        padding: "10px"
                    }
                }}
                onClose={() => { setMobileOpen(false) }}
                onOpen={() => { setMobileOpen(true) }}
            >
                {
                    logs.map((log, index) => {
                        return (
                            <p key={index}>{log}</p>
                        )
                    })
                }
            </SwipeableDrawer>
        </Box>
    );
}

export default Navbar
