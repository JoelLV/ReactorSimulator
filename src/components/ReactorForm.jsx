import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';


function ReactorForm({ reactorName, id }) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const changeName = async () => {
        console.log("fetching")
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
            console.log("succeed")
            handleClose()
        } catch (error) {
            console.log(error)
        }
    }

    const handleNameChange = ({ target }) => {
        const { value } = target
        setName(value)
        console.log(value)
    }

    return (
        <div>
            <h1 id="reactorName">{reactorName}</h1>
            <div className='form'>
                <Button variant="outlined" onClick={handleClickOpen}>
                    <EditIcon />
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Name</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter a name for your Reactor.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Plant Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={handleNameChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={changeName}>Submit</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default ReactorForm