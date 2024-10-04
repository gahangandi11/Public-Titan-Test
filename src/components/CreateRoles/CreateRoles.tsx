
import React, { useState, useEffect } from 'react'


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { UserRole } from '../../interfaces/UserRoles';
import { getRoles, getRoleCount, createRole } from '../../services/firestoreService';
import { IonButton, IonIcon } from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import './CreateRoles.css'

const CreateRoles = () => {

  const pages = ["Live Data", "Dashboard", "Data Download", "App Center"]

  const [open, setOpen] = React.useState(false);


  const [Roles, setRoles] = useState<UserRole[] | null>(null);
  const [Count, setCount] = useState<any>(null);

  const [selectedPages, setSelectedPages] = useState<string[]>(["HomePage", "Support", "Profile"]);

  const [fetchTrigger, setFetchTrigger] = useState(false);



  useEffect(() => {
    const fetchdata = async () => {
      const data = await getRoles();
      setRoles(data);
    };
    fetchdata();
  }, [fetchTrigger])

  useEffect(() => {
    const fetchdata = async () => {
      const data = await getRoleCount(Roles);
      setCount(data);
    };
    fetchdata();
  }, [Roles])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPages([]);
  };

  const handlePageClick = (page: string) => {
    setSelectedPages((prevSelected) =>
      prevSelected.includes(page) ? prevSelected.filter((selectedPage) => selectedPage !== page) : [...prevSelected, page]
    );
  }

  return (
    <div className='create-role'>
      <div className='create-user-role'>
        <div className='create-user-button' onClick={handleClickOpen}>
          Create New Role
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }} align='center'>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Permissions</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">User Count</TableCell>
              {/* <TableCell sx={{ fontWeight: 'bold' }} align="center">Delete</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {Roles && Roles.map((role, index) =>
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" align="left" sx={{ width: '15%', paddingLeft: '35px' }}>
                  {role.role}
                </TableCell>
                <TableCell component="th" scope="row" align="center" sx={{ width: '55%' }}>
                  <div className='permissions'>
                    {role.permissions.map((permission, index) => (!(['HomePage','Profile','Support','Tutorials'].includes(permission)) && <span key={index}>{permission},</span>))}
                  </div>
                </TableCell>
                <TableCell component="th" scope="row" align="center" sx={{ width: '15%' }}>
                  {Count ? <span>{Count[role.role]} </span> : <span>0</span>}
                </TableCell>
                {/* <TableCell component="th" scope="row" align="center" sx={{ width: '15%' }}>
                  <IonButton color="danger" >
                    <IonIcon icon={closeCircleOutline} />
                  </IonButton>
                </TableCell> */}
              </TableRow>
            )
            }
          </TableBody>
        </Table>

      </TableContainer>


      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            await createRole(email, selectedPages);
            setFetchTrigger(prev => !prev);
            handleClose();
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Create New Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create new role, please enter the role name and select the permissions for the role below and click on submit
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Role Name"
            fullWidth
            variant="standard"
          />
          <div className='permissions-header'>
            Select the permissions for role below
          </div>
          <div className='pages-list'>
            {
              pages.map((page, index) => (
                <div key={index} className={`each-page ${selectedPages.includes(page) ? 'selected' : ''}`}
                  onClick={() => handlePageClick(page)}>
                  {page}
                </div>
              ))
            }
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CreateRoles