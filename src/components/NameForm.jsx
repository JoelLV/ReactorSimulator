import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import EditIcon from '@mui/icons-material/Edit'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import { useSnackbar } from "notistack"
import { useState } from 'react'

const NameForm = ({ plantName }) => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const changeName = async () => {
        try {
            setIsSubmitting(true)
            const response = await fetch(`https://nuclear.dacoder.io/reactors/plant-name?apiKey=6cc0a3fa7141b32d`, {
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
    
    const handleNameChange = ({ target }) => {
        const {value} = target
        setName(value)
    }

    return (
        <div>
            <h1 id="powerName">{plantName}</h1>
            <div className='form'>
                <Button variant="outlined" onClick={handleClickOpen}>
                    <EditIcon />
                </Button>
                <Dialog open={open} onClose={handleClose} disableScrollLock={true}>
                    <DialogTitle>Name</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter a name for your Power Plant.
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
    )
}

export default NameForm