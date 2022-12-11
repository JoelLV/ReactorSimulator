import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import { useSnackbar } from "notistack"
import { useState } from 'react';


function ReactorForm({ reactorName, id }) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    /**
     * Fetches from the reactor the id to the name
     */
    const changeName = async () => {
        try {
            setIsSubmitting(true)
            const response =  await fetch(`https://nuclear.dacoder.io/reactors/set-reactor-name/${id}?apiKey=6cc0a3fa7141b32d`, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name
                })
            })

            if (!response.ok) {
                const errorMessage = await response.json()
                enqueueSnackbar(errorMessage.message, {
                    preventDuplicate: true
                })
            }
        } catch (error) {
        } finally {
            setIsSubmitting(false)
            handleClose()
        }
    }

    /**
     * This grabs the changes made in the text box and sets the name of it to the value
     */
    const handleNameChange = ({ target }) => {
        const { value } = target
        setName(value)
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
                        <Button onClick={changeName}>{isSubmitting ? <HourglassBottomIcon /> : "Submit"}</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default ReactorForm