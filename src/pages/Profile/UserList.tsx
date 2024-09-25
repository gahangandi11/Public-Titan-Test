import React, { useState, useEffect } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { getRoles } from '../../services/firestoreService';
import { UserRole } from '../../interfaces/UserRoles';
import { User } from '../../interfaces/User';
import DeleteUserAlert from './DeleteUserAlert';

interface UserListProps {
  newUsers: User[];
  setAccess: (value: any) => void;
  changeUserStatus: (user: any) => void;
  removeUser: (user: any) => void;
  setUserDeleteMessage: (value: any) => void;
  value: string;
}
interface DropdownSelections {
  [userId: string]: string;
}


const UserList: React.FC<UserListProps> = ({ newUsers, setAccess, changeUserStatus, removeUser, setUserDeleteMessage, value }) => {

  const [selections, setSelections] = useState<DropdownSelections>({});
  const [Roles, setRoles] = useState<UserRole[] | null>(null);

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
    console.log(open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const callremoveUser = () => {
    removeUser(deleteUser);
  }


  useEffect(() => {
    const fetchdata = async () => {
      const data = await getRoles();
      setRoles(data);
    };
    fetchdata();
  }, []);

  const handleDropdownChange = (userId: string, value: string) => {
    setSelections(prevSelections => ({
      ...prevSelections,
      [userId]: value,
    }));
    setAccess(value);
  };

  return (
    <>
      <TableContainer component={Paper}>

        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Short Description</TableCell>
              {value === '1' ? <TableCell sx={{ fontWeight: 'bold' }} align="right">Set Access</TableCell> : <TableCell sx={{ fontWeight: 'bold' }} align="right">Access Level</TableCell>}
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Approve</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Reject</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {newUsers.map((user, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" sx={{ width: '10%' }}>
                  {user.email}
                </TableCell>
                <TableCell align="center" sx={{ width: '30%' }}>
                  {user.shortDescription ? <div>{user.shortDescription}</div> : <div>-</div>}
                </TableCell>
                <TableCell align="right">
                  {value === '1' ?
                    <FormControl variant="standard" sx={{ width: 100 }}>
                      <InputLabel id="demo-simple-select-standard-label">Access</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selections[user.uid] || ''}
                        label="Age"
                        onChange={(e) => handleDropdownChange(user.uid, e.target.value)}
                      >
                        {
                          Roles && Roles.map((role, index) => (
                            <MenuItem key={index} value={role.role}>{role.role}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl> : <p>{user?.role}</p>
                  }

                </TableCell>
                <TableCell align="right">
                  <IonButton color="success" onClick={() => {
                    if (!selections[user.uid] && value === '1') {
                      alert('Please set Access level for user before approving.');
                    } else {
                      changeUserStatus(user)
                    }
                  }}>
                    <IonIcon icon={checkmarkCircleOutline} />
                  </IonButton>
                </TableCell>
                <TableCell align="right">
                  <IonButton color="danger" onClick={() => { setDeleteUser(user); handleClickOpen(); }}>
                    <IonIcon icon={closeCircleOutline} />
                  </IonButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </TableContainer>
      <DeleteUserAlert open={open} handleClose={handleClose} callremoveUser={callremoveUser} setUserDeleteMessage={setUserDeleteMessage} />
    </>
  );


};

export default UserList;