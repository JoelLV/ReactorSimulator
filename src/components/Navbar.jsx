import * as React from 'react';
import { SwipeableDrawer } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';



function Navbar(props) {

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [logs, setLogs] = useState([])

  // takes array and puts it into one array essentially then grabbing values so that we can grab the strings of each id
  const getLogs = async () => {
    const rawLogs = await fetch("https://nuclear.dacoder.io/reactors/logs?apiKey=6cc0a3fa7141b32d")
    const jsonLogs = await rawLogs.json()
    const stringLogs = jsonLogs.flatMap(log => {
      return Object.keys(log).flatMap(key => {
        return log[key]
      })
    })
    setLogs(stringLogs)
  }

  useEffect(() => {
    const timer = setInterval(getLogs, 250)

    return () => {
      clearInterval(timer)
    }
  }, [])
  

  const handleDrawerChange = (val) => {
    setMobileOpen(val);
  };

  return (
    <Box sx={{ display: 'flex', }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => { handleDrawerChange(true) }}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Reactor
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button sx={{ color: '#fff' }}>
              Global Reset
            </Button>
            <Button sx={{ color: '#fff' }} onClick={() => { handleDrawerChange(true) }}>
              Open Log
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor={"bottom"}
        open={mobileOpen}
        PaperProps={{
          sx: {
            maxHeight: "40vh",
            padding: "10px"
          }
        }}
        onClose={() => { handleDrawerChange(false) }}
        onOpen={() => { handleDrawerChange(true) }}
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

export default Navbar;
