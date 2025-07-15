import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { Issue } from '../../interfaces/Issue';
import { GetIssueById } from '../../services/firestoreService';
import Header from '../../components/Header/Header';
import { AddCommentSubCollectionToIssue, GetCommentsByIssueId, updateIssueStatus, sendIssueEmailUpdates } from '../../services/firestoreService';
import { getCurrentUser } from '../../services/contexts/AuthContext/AuthContext';

import {
    Container, Box, Typography, Button, Chip, Stack, Card, CardContent, Divider, TextField, List, ListItem, ListItemText, ListItemAvatar,
    Avatar
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon, AssignmentInd as AssignmentIndIcon, Label as LabelIcon, Event as EventIcon, Comment as CommentIcon, Image as ImageIcon
} from '@mui/icons-material';
import { Comment } from '../../interfaces/Comment';
import { IonPage, IonContent } from '@ionic/react';
import { Timestamp } from 'firebase/firestore';


const IssueDetail: React.FC = () => {
    const { issueId } = useParams<{ issueId: string }>();
    const user = getCurrentUser();
    const [issue, setIssue] = useState<Issue>();
    const [commentInput, setCommentInput] = useState<string>('');
    const [comments, setComments] = useState<Comment[]>([]);
    const history = useHistory();

    useEffect(() => {
        const fetchIssue = async () => {
            if (issueId) {
                const fetchedIssue = await GetIssueById(issueId);
                setIssue(fetchedIssue);
            }
        };
        const fetchComments = async () => {
            if (issueId) {
                const fetchedComments = await GetCommentsByIssueId(issueId);
                setComments(fetchedComments);
            }
        };
        fetchIssue();
        fetchComments();
    }
        , [issueId]);

    const handleBackToIssues = () => {
        history.push('/issues');
    };

    const AddComment = async () => {
        if (!issueId || !commentInput.trim() || !user?.email || !issue) return;
        const comment = {
            text: commentInput,
            authorId: user.email,
        };
        try {
            await AddCommentSubCollectionToIssue(issueId, comment);
            await sendIssueEmailUpdates(issue.createdBy, issue.title,commentInput, 'IssueCommented');
            const updatedComments: Comment[] = await GetCommentsByIssueId(issueId);
            setComments(updatedComments);
            setCommentInput('');
            const updatedIssue = await GetIssueById(issueId);
            setIssue(updatedIssue);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }

    const onUpdateIssue = async (status: Issue["status"]) => {
        if (!issueId || !user?.email || !issue) return;
        try {
            await sendIssueEmailUpdates(issue.createdBy, issue.title,commentInput,'IssueStatusChanged');
            await updateIssueStatus(issueId, status);
            const updatedIssue = await GetIssueById(issueId);
            setIssue(updatedIssue);
        } catch (error) {
            console.error("Error closing issue:", error);
        }
    }

    return (
        <IonPage>
            <Header title={"Issue Details"} />
            <IonContent fullscreen color="light">
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackToIssues} sx={{ mb: 3 }}>
                        Back to Issues
                    </Button>
                    <Card elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 1, minWidth: 0 }}>
                                    <Typography variant="h4" component="h1"
                                        sx={{ mr: 2, flexShrink: 1, minWidth: 0, textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>
                                        {issue?.title}
                                    </Typography>
                                    <Chip label={issue?.status} size="small"
                                        sx={{ flexShrink: 0, backgroundColor: issue?.status === 'Open' ? '#25a84a' : issue?.status === 'Pending' ? '#f5a623' : '#ab7df8', color: 'white' }} />
                                </Box>

                                {/* Right Section: Labels */}
                                {issue?.labels && issue.labels.length > 0 && (
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ flexShrink: 0, justifyContent: 'flex-end' }}>
                                        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LabelIcon sx={{ mr: 0.5 }} fontSize="small" />
                                        </Typography>
                                        {issue.labels.map((label, index) => {
                                            return (
                                                <Chip key={index} label={label} size="small" variant="filled"
                                                    sx={{
                                                        bgcolor: (label === 'bug' ? '#B60205' : label === 'enhancement' ? '#A2EEB0' : label === 'help wanted' ? '#008672' : label === 'question' ? '#D876E3' : label === 'invalid' ? '#7057FF' : '#CFD3D7'),
                                                        color: (label === 'bug' || label === 'help wanted' || label === 'question' || label === 'invalid') ? '#FFFFFF' : '#333333',
                                                        fontWeight: 'bold', padding: '3px 6px',
                                                    }}
                                                />
                                            );
                                        })}
                                    </Stack>
                                )}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                                {issue?.description}
                            </Typography>
                            <Divider sx={{ my: 2 }} /> {/* Separator */}

                            {/* Attached Images Section */}
                            {issue?.ImageUrls && issue.ImageUrls.length > 0 && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ mt: 2, mb: 2 }}>
                                        <Typography variant="h6" component="div" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <ImageIcon sx={{ mr: 1, color: 'action.active' }} />
                                            Attached Images
                                        </Typography>
                                        <Stack spacing={2} sx={{ mt: 1 }}>
                                            {issue.ImageUrls.map((url, index) => (
                                                <Box
                                                    key={index}
                                                    component="img"
                                                    src={url}
                                                    alt={`Attached image ${index + 1}`}
                                                    sx={{
                                                        maxWidth: '100%', // Responsive width
                                                        maxHeight: '400px', // Max height for very tall images
                                                        height: 'auto', // Maintain aspect ratio
                                                        borderRadius: 1, // Rounded corners
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        objectFit: 'contain', // Ensure whole image is visible
                                                        display: 'block', // Remove extra space below image
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>
                                </>
                            )}


                            <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                                {issue?.createdBy && (
                                    <Chip icon={<AssignmentIndIcon />} label={`Created by: ${issue.createdBy}`} variant="outlined" color="default" size="small" />
                                )}
                                {issue?.createdAt && (
                                    <Chip icon={<EventIcon />}
                                        label={`Created: ${issue.createdAt instanceof Timestamp ? issue.createdAt?.toDate().toLocaleString() : 'N/A'}`}
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                                {issue?.updatedAt && (
                                    <Chip
                                        icon={<EventIcon />}
                                        label={`Updated: ${issue.updatedAt instanceof Timestamp ? issue.updatedAt?.toDate().toLocaleString() : 'N/A'}`}
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                                {issue?.commentsCount !== undefined && (
                                    <Chip
                                        icon={<CommentIcon />}
                                        label={`${issue.commentsCount} comments`}
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                    <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
                        Comments ({comments.length})
                    </Typography>
                    <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, mb: 4 }}>
                        {comments.length === 0 ? (
                            <ListItem>
                                <ListItemText secondary="No comments yet. Be the first to comment!" />
                            </ListItem>
                        ) : (
                            [...comments].sort((a, b) => {
                                const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : 0;
                                const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : 0;
                                return dateB - dateA; // For descending order (recent first)
                            }).map((comment) => (
                                <ListItem key={comment.id} alignItems="flex-start"
                                    sx={{ borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' }, py: 2 }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                                            {comment.authorId ? comment.authorId.substring(0, 2).toUpperCase() : '??'}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center" flexWrap="wrap">
                                                <Typography component="span" variant="subtitle2" color="text.primary" sx={{ mr: 1, fontWeight: 'bold' }}>
                                                    {comment.authorId}
                                                </Typography>
                                                <Typography component="span" variant="caption" color="text.secondary">
                                                    commented on {comment.createdAt instanceof Timestamp ? comment.createdAt.toDate().toLocaleString() : 'N/A'}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Typography sx={{ display: 'block', whiteSpace: 'pre-wrap', mt: 0.5 }} component="span" variant="body2" color="text.primary">
                                                {comment.text}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                    {
                        issue?.status === 'Closed' ? (
                            <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                                <CommentIcon sx={{ fontSize: 40, color: '#ab7df8', mb: 1 }} />
                                <Typography variant="h5" gutterBottom color={'#ab7df8'}>
                                    Issue Closed
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    This issue has been closed and comments can no longer be added.
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                                <TextField label="Leave a comment..." multiline rows={4} fullWidth variant="outlined" value={commentInput} onChange={(e) => setCommentInput(e.target.value)}
                                    sx={{ '& .MuiInputBase-input': { color: '#333333' }, '& .MuiInputLabel-root': { color: '#666666' } }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                    <Button variant="outlined" color="error" onClick={() => {AddComment(); onUpdateIssue('Closed')}}>
                                        Close Issue
                                    </Button>
                                    {issue?.status !== 'Pending' && (
                                        <Button variant="outlined" color="warning" onClick={()=>{AddComment(); onUpdateIssue('Pending')}}>
                                            Mark as Pending
                                        </Button>
                                    )}
                                    <Button variant="contained" color="primary" onClick={() => { AddComment() }}>
                                        Add Comment
                                    </Button>
                                </Box>
                            </Box>

                        )
                    }

                </Container>
            </IonContent>
        </IonPage>
    )
}

export default IssueDetail