import React from 'react'
import { useState } from 'react'
import Header from '../../components/Header/Header'
import { Container, Box, TextField, Button, Typography, Grid, Stack, Chip, FormHelperText } from '@mui/material';
import { CreateIssue } from '../../services/firestoreService';
import { getCurrentUser } from '../../services/contexts/AuthContext/AuthContext';
import { Issue } from '../../interfaces/Issue';
import { useHistory } from 'react-router';

interface PredefinedLabel {
    name: string;
    color: string; 
    description: string;
}


const NewIssue: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [labelsError, setLabelsError] = useState<string>(''); // State for label validation error

    const history = useHistory();

    const predefinedLabels: PredefinedLabel[] = [
        { name: 'bug', color: '#B60205', description: 'Something isn\'t working' },
        { name: 'enhancement', color: '#A2EEB0', description: 'New feature or request' },
        { name: 'help wanted', color: '#008672', description: 'Extra attention is needed' },
        { name: 'question', color: '#D876E3', description: 'Further information is requested' },
        { name: 'invalid', color: '#7057FF', description: 'This does not seem right' },
    ];


    const user = getCurrentUser();

    const handleLabelClick = (labelName: string) => {
        // Toggle label selection
        if (selectedLabels.includes(labelName)) {
            setSelectedLabels(selectedLabels.filter(name => name !== labelName));
            setLabelsError(''); 
        } else {
            setSelectedLabels([...selectedLabels, labelName]);
            setLabelsError(''); 
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(user === null || user.email === null) {
            console.error("User is not authenticated");
            return;
        }

        if (selectedLabels.length === 0) {
            setLabelsError('Please select at least one label.');
            return; // Prevent form submission
        }

        const newIssue: Omit<Issue,'id' | 'createdAt' | 'updatedAt' | 'commentsCount' > = {
            title,
            description,
            status: 'Open',
            createdBy: user.email,
            labels: selectedLabels,
        };
        await CreateIssue(newIssue);
        setTitle('');
        setDescription('');
        setSelectedLabels([]);
        history.push('/issues'); 
    };

    return (
        <>
            <Header title={"New Issue"} />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box component="form" onSubmit={handleSubmit}
                    sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Create New Issue
                    </Typography>
                    <TextField label="Title" variant="outlined" fullWidth required value={title}
                        onChange={(e) => setTitle(e.target.value)} sx={{ input: { color: 'black' } }} />
                    <TextField label="Description" variant="outlined" fullWidth multiline rows={10} required value={description}
                        onChange={(e) => setDescription(e.target.value)} inputProps={{ style: { color: "black" } }} />

                    <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}>
                                Assign Labels<span style={{ color: 'grey' }}>*</span>
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {predefinedLabels.map((label) => (
                                    <Chip key={label.name} label={label.name} onClick={() => handleLabelClick(label.name)}
                                        sx={{ bgcolor: label.color,
                                            color: (label.color === '#CFD3D7' || label.color === '#FFFFFF' || label.color === '#A2EEB0') ? '#333333' : '#FFFFFF', 
                                            border: selectedLabels.includes(label.name) ? '2px solid #1976d2' : '1px solid rgba(0, 0, 0, 0.23)', 
                                            fontWeight: selectedLabels.includes(label.name) ? 'bold' : 'normal',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                opacity: 0.9,
                                                bgcolor: label.color,
                                            }
                                        }}
                                        // Show description on hover
                                        title={label.description}
                                    />
                                ))}
                            </Stack>
                            {labelsError && (
                            <FormHelperText error sx={{ mt: 1 }}>
                                {labelsError}
                            </FormHelperText>
                        )}
                            {selectedLabels.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Selected: {selectedLabels.join(', ')}
                                    </Typography>
                                </Box>
                            )}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button variant='outlined' onClick={()=>history.push('/issues')}>
                            Cancel
                        </Button>
                        <Button variant='contained' color='primary' type='submit' >
                            Submit
                        </Button>
                    </Box>
                    
                </Box>
            </Container>
        </>
    )
}

export default NewIssue