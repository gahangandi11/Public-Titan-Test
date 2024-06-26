import React, {useState} from 'react';
import { IonItem, IonRow, IonSelect, IonSelectOption, IonButton, IonIcon } from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';

import {User} from '../../interfaces/User';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { set } from 'date-fns';

interface UserListProps {
    newUsers: User[]; // Adjust the type according to your data structure
    access: string; // Adjust the type according to your data structure
    setAccess: (value: any) => void; // Specify the correct type for `value`
    changeUserStatus: (user: any) => void; // Specify the correct type for `user`
    removeUser: (user: any) => void; // Specify the correct type for `user`
  }
  interface DropdownSelections {
    [userId: string]: string; // Maps userId to the selected dropdown value
  }


const UserList: React.FC<UserListProps> = ({ newUsers, access, setAccess, changeUserStatus, removeUser }) => {

    const [selections, setSelections] = useState<DropdownSelections>({});

    const handleDropdownChange = (userId: string, value: string) => {
        setSelections(prevSelections => ({
          ...prevSelections,
          [userId]: value, // Only update the selection for this userId
        }));
        setAccess(value);
      };

    return (

        <TableContainer component={Paper}>

            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Short Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Set Access</TableCell>
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
                                <FormControl variant="standard" sx={{width: 100}}>
                                    <InputLabel id="demo-simple-select-standard-label">Access</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selections[user.uid] || ''}
                                    label="Age"
                                    onChange={(e) =>handleDropdownChange(user.uid, e.target.value)}
                                    >
                                        <MenuItem value={'full'}>Full</MenuItem>
                                        <MenuItem value={'limited'}>Limited</MenuItem>
                                    </Select>
                                </FormControl>
                          
                            </TableCell>
                            <TableCell align="right">
                              <IonButton color="success" onClick={() =>{ 
                                if (!selections[user.uid]) {
                                    alert('Please set Access level for user before approving.');
                                  } else {
                                changeUserStatus(user)}}}>
                                 <IonIcon icon={checkmarkCircleOutline} />
                             </IonButton>     
                            </TableCell>
                            <TableCell align="right">
                                <IonButton color="danger" onClick={() => removeUser(user)}>
                                    <IonIcon icon={closeCircleOutline} />
                                </IonButton>
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
            </Table>
        
        </TableContainer>
      );


};

export default UserList;