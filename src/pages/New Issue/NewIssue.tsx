import React from 'react'
import { useState } from 'react'
import Header from '../../components/Header/Header'
import { Container, Box, TextField, Button, Typography, Grid, Stack, Chip, FormHelperText, IconButton, CircularProgress } from '@mui/material';
import { CreateIssue } from '../../services/firestoreService';
import { getCurrentUser } from '../../services/contexts/AuthContext/AuthContext';
import { Issue } from '../../interfaces/Issue';
import { useHistory } from 'react-router';
import { PhotoCamera, Clear as ClearIcon } from '@mui/icons-material';
import { IonPage, IonContent } from '@ionic/react';
import { set } from 'date-fns';

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
    const [imageFiles, setImageFiles] = useState<File[]>([]); // Changed to handle multiple files
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]); // Changed to handle multiple preview URLs
    const [imageUploadError, setImageUploadError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
        if (user === null || user.email === null) {
            console.error("User is not authenticated");
            return;
        }

        if (selectedLabels.length === 0) {
            setLabelsError('Please select at least one label.');
            return; // Prevent form submission
        }

        const newIssue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'commentsCount'> = {
            title,
            description,
            status: 'Open',
            createdBy: user.email,
            labels: selectedLabels,
        };
        setIsSubmitting(true);
        await CreateIssue(newIssue, imageFiles);
        setTitle('');
        setDescription('');
        setSelectedLabels([]);
        setIsSubmitting(false);
        history.push('/issues');
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageUploadError('');
        const files = event.target.files;
        if (files && files.length > 0) {
            const newFiles: File[] = [];
            const newPreviewUrls: string[] = [];
            let anyError = false;

            Array.from(files).forEach(file => {
                if (!file.type.startsWith('image/')) {
                    setImageUploadError('Invalid file type detected. Please select only images.');
                    anyError = true;
                    return; // Skip this file
                }
                if (file.size > 5 * 1024 * 1024) { // 5MB limit per file
                    setImageUploadError(`File "${file.name}" is too large. Maximum size is 5MB.`);
                    anyError = true;
                    return; // Skip this file
                }
                newFiles.push(file);
                newPreviewUrls.push(URL.createObjectURL(file));
            });

            if (!anyError) {
                setImageFiles(prevFiles => [...prevFiles, ...newFiles]);
                setImagePreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
            } else {
                // Clean up newly created object URLs if there was an error with other files
                newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
            }
        }
        // Clear the input value to allow selecting the same file(s) again if cleared
        if (event.target) {
            event.target.value = "";
        }
    };

    const handleClearImage = (indexToRemove: number) => {
        // Revoke the object URL to free up memory
        URL.revokeObjectURL(imagePreviewUrls[indexToRemove]);

        setImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
        setImagePreviewUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToRemove));
        setImageUploadError(''); // Clear general error when a specific image is removed
    };

    return (
        <IonPage>
            <Header title={"New Issue"} />
            <IonContent fullscreen color="light">
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
                                        sx={{
                                            bgcolor: label.color,
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

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}>
                                Attach Images (Optional)
                            </Typography>
                            <Stack direction="column" spacing={2} alignItems="flex-start">
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<PhotoCamera />}
                                    disabled={isSubmitting}
                                >
                                    Select Images
                                    <input
                                        type="file"
                                        hidden
                                        multiple // Allow multiple file selection
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={isSubmitting}
                                    />
                                </Button>
                                {imageUploadError && (
                                    <FormHelperText error>
                                        {imageUploadError}
                                    </FormHelperText>
                                )}
                                {imagePreviewUrls.length > 0 && (
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                                        {imagePreviewUrls.map((url, index) => (
                                            <Box key={index} sx={{ position: 'relative', border: '1px solid #ddd', borderRadius: 1, p: 0.5, width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src={url} alt={`Preview ${index + 1}`} style={{ maxHeight: '100%', maxWidth: '100%', display: 'block', borderRadius: '4px' }} />
                                                {!isSubmitting && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleClearImage(index)}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 2,
                                                            right: 2,
                                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                                                            padding: '2px'
                                                        }}
                                                        title={`Remove image ${index + 1}`}
                                                    >
                                                        <ClearIcon fontSize="inherit" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        ))}
                                    </Stack>
                                )}
                            </Stack>
                        </Grid>


                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <Button variant='outlined' onClick={() => history.push('/issues')} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button variant='contained' color='primary' type='submit' disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}>
                                {isSubmitting ? 'Submitting...' : 'Submit Issue'}
                            </Button>
                        </Box>

                    </Box>
                </Container>
            </IonContent>
        </IonPage>
    )
}

export default NewIssue