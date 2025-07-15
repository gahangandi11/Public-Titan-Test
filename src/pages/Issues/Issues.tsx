import React, { useEffect, useState, useMemo } from 'react';
import Header from '../../components/Header/Header';
import './Issues.css';
import { useHistory } from 'react-router';
import { GetIssues } from '../../services/firestoreService';
import { Issue } from '../../interfaces/Issue';
import { Button, Box, Container, Typography, List, ListItem, ListItemText, Chip, Stack, } from '@mui/material';
import {
    Add as AddIcon,
    Comment as CommentIcon,
    Label as LabelIcon,
    AssignmentInd as AssignmentIndIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import { Timestamp } from 'firebase/firestore';

import { IonPage, IonContent } from '@ionic/react';

const Issues: React.FC = () => {

    const [issues, setIssues] = useState<Issue[]>([]);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Open' | 'Closed' | 'Pending'>('All');

    useEffect(() => {
        // Fetch issues when the component mounts
        const fetchIssues = async () => {
            try {
                const issues = await GetIssues();
                setIssues(issues);
            } catch (error) {
                console.error('Error fetching issues:', error);
            }
        };
        fetchIssues();
    }, []);

    const history = useHistory();

    const handleNewIssueClick = () => {
        history.push('/issues-new'); // Redirect to the new issue page
    };

    // const getFilterButtonStyle = (status: 'All' | 'Open' | 'Closed') => ({
    //     display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.5, borderRadius: 2, cursor: 'pointer', userSelect: 'none',
    //     // Style for selected filter
    //     fontWeight: filterStatus === status ? 'bold' : 'normal',
    //     color: filterStatus === status ? 'text.primary' : 'text.secondary',
    //     bgcolor: filterStatus === status ? 'action.selected' : 'transparent',
    //     transition: 'background-color 0.2s ease-in-out',
    //     '&:hover': {
    //         bgcolor: filterStatus === status ? 'action.selected' : 'action.hover',
    //     }
    // });

    const getFilterButtonStyle = (status: 'All' | 'Open' | 'Closed' | 'Pending') => ({
        display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.5, borderRadius: 2, cursor: 'pointer', userSelect: 'none',
        // Style for selected filter
        fontWeight: filterStatus === status ? 'bold' : 'normal',
        color: filterStatus === status ? 'text.primary' : 'text.secondary',
        bgcolor: filterStatus === status ? 'action.selected' : 'transparent',
        transition: 'background-color 0.2s ease-in-out',
        '&:hover': {
            bgcolor: filterStatus === status ? 'action.selected' : 'action.hover',
        }
    });

    const handleIssueClick = (issueId: string) => {
        history.push(`/issues/${issueId}`); // This directly triggers the navigation
    };

    // Memoized filtered and sorted issues
    const filteredAndSortedIssues = useMemo(() => {
        let filtered = [...issues]; // Create a shallow copy to avoid mutating the original state

        if (filterStatus !== 'All') {
            filtered = filtered.filter(issue => issue.status === filterStatus);
        }

        // Sort by createdAt in descending order (recent first)
        filtered.sort((a, b) => {
            const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : 0;
            const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : 0;
            return dateB - dateA; // For descending order
        });

        return filtered;
    }, [issues, filterStatus]);

    const openCount = useMemo(() => issues.filter(issue => issue.status === 'Open').length, [issues]);
    const closedCount = useMemo(() => issues.filter(issue => issue.status === 'Closed').length, [issues]);
    const pendingCount = useMemo(() => issues.filter(issue => issue.status === 'Pending').length, [issues]);
    const allCount = issues.length;

    return (
        <IonPage>
            <Header title={"Issues"} />
            <IonContent fullscreen color="light">
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Box display="flex" justifyContent="flex-end" mb={3}>
                        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleNewIssueClick}>
                            New Issue
                        </Button>
                    </Box>

                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f0f7f2',
                        border: '1px solid #d0d0d0', borderRadius: 1, p: 1
                    }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                                sx={getFilterButtonStyle('All')}
                                onClick={() => setFilterStatus('All')}
                            >
                                <Typography variant="body2">All</Typography>
                                <Chip label={allCount} size="small" sx={{ ml: 0.5 }} />
                            </Box>
                            <Box
                                sx={getFilterButtonStyle('Open')}
                                onClick={() => setFilterStatus('Open')}
                            >
                                <Typography variant="body2">Open</Typography>
                                <Chip label={openCount} size="small" color="success" sx={{ ml: 0.5 }} />
                            </Box>
                            <Box
                                sx={getFilterButtonStyle('Pending')}
                                onClick={() => setFilterStatus('Pending')}
                            >
                                <Typography variant="body2">Pending</Typography>
                                <Chip label={pendingCount} size="small" sx={{ ml: 0.5, backgroundColor: '#f5a623', color: 'white' }} />
                            </Box>
                            <Box
                                sx={getFilterButtonStyle('Closed')}
                                onClick={() => setFilterStatus('Closed')}
                            >
                                <Typography variant="body2">Closed</Typography>
                                <Chip label={closedCount} size="small" sx={{ ml: 0.5, backgroundColor: '#ab7df8', color: 'white' }} />
                            </Box>
                        </Stack>
                    </Box>

                    {filteredAndSortedIssues.length === 0 ? (
                        <Box sx={{ p: 3, border: '1px dashed #ccc', textAlign: 'center', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                            <Typography variant="h6" color="text.secondary">No issues found.</Typography>
                        </Box>
                    ) : (
                        <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, overflow: 'hidden' }}>
                            {filteredAndSortedIssues.map((issue) => (
                                <ListItem key={issue.id} onClick={() => handleIssueClick(issue.id)} sx={{
                                    borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' }, border: '1px solid #d0d0d0', borderRadius: 1,
                                    cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, py: 2, px: 3,
                                }}>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} >
                                                <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 1, minWidth: 0 }}>
                                                    <Typography variant="h5" component="span"
                                                        sx={{ mr: 1, fontWeight: 'medium', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                    >
                                                        {issue.title}
                                                    </Typography>
                                                    <Chip label={issue.status}  size="small" sx={{backgroundColor: issue?.status === 'Open' ? '#25a84a' : issue?.status === 'Pending' ? '#f5a623' : '#ab7df8', color:'white'}}/>
                                                </Box>
                                                {/* Labels Section */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, flexShrink: 0 }}>
                                                    <LabelIcon fontSize="small" color="action" /> 
                                                    {issue.labels && issue.labels.length > 0 && (
                                                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                                            {issue.labels.map((label, index) => (
                                                                <Chip key={index} label={label} size="small" variant="outlined"
                                                                    sx={{
                                                                        bgcolor: (label === 'bug' ? '#B60205' : label === 'enhancement' ? '#A2EEB0' : label === 'help wanted' ? '#008672' : label === 'question' ? '#D876E3' : label === 'invalid' ? '#7057FF' : '#CFD3D7'), 
                                                                        color: (label === 'bug' || label === 'help wanted' || label === 'question' || label === 'invalid') ? '#FFFFFF' : '#333333', 
                                                                        border: '1px solid rgba(0, 0, 0, 0.23)', 
                                                                        fontWeight: 'bold',
                                                                        padding: '3px 6px',
                                                                    }} />
                                                            ))}
                                                        </Stack>
                                                    )}
                                                </Box>
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center',  }}>
                                                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', minWidth: '300px' }}>
                                                    <AssignmentIndIcon fontSize="small" sx={{ mr: 0.5 }} /> {issue.createdBy}
                                                </Typography>
                                                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EventIcon fontSize="small" sx={{ mr: 0.5 }} /> Created :{' '}
                                                    {issue.createdAt instanceof Timestamp ? issue.createdAt?.toDate().toLocaleString() : 'N/A'}
                                                </Typography>
                                                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', ml:3 }}>
                                                    <CommentIcon fontSize="small" sx={{ mr: 0.5 }} /> {issue.commentsCount || 0} comments
                                                </Typography>
                                            </Box>
                                        }
                                        secondaryTypographyProps={{ component: 'span' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Container>
            </IonContent>
        </IonPage>
    );
}

export default Issues;