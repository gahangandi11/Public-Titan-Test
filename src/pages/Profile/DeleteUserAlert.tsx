import React from 'react'


import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Box from '@mui/material/Box';


interface DeleteUserAlertProps{
    open: boolean;
    handleClose: ()=>void;
    callremoveUser : ()=>void;
    setUserDeleteMessage : (value:any)=>void;
}

const DeleteUserAlert: React.FC<DeleteUserAlertProps> = ({open,handleClose,callremoveUser, setUserDeleteMessage}) => {
   
    return (
      <React.Fragment>
    
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          }}
        >
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{paddingBottom:'20px'}}>
              Please provide a reason for Rejection. This will be sent to the user and the user will be asked to register again.
            </DialogContentText>
            <TextField
                id="outlined-multiline-static"                
                multiline
                rows={4}
                sx={{width:'95%'}}
                onChange={(e)=>{setUserDeleteMessage(e.target.value)}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={callremoveUser}>Reject User</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
}

export default DeleteUserAlert