import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';

function NameForm() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);


    };

    return (
        <div>
            <h1 id="powerName">Enter Power Plant Name</h1>
            <div className='form'>
                <Button variant="outlined" onClick={handleClickOpen}>
                    <EditIcon />
                </Button>
                <Dialog open={open} onClose={handleClose}>
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
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleClose}>Name</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default NameForm