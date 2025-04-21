import React, { useState, useEffect } from "react";
import Navbar from './Components/Navbar';
import './styles.css'

function Discussions() {
    const [showPopup, setShowPopup] = useState(false);
    const [showComments, setShowComments] = useState(null); 
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [commentText, setCommentText] = useState("");
    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState(""); 

    useEffect(() => {
        fetch('/profile')
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch user profile');
            }
            return response.text(); // Assuming the backend returns the username as plain text
          })
          .then(data => {
            console.log('Fetched username:', data); 
            setUsername(data); 
          })
          .catch(error => {
            console.error('Error fetching user profile:', error);
            alert('Failed to load user profile. Please try again.');
          });
      }, []);

    useEffect(() => {
        fetch('/getDiscussions')
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching discussions:', error));
    }, []);



    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create a new post with the form data
        const newPost = {
            title,
            description,
            posterName: username,  
            comments: [],
        };

        fetch('/createDiscussion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            return response.json(); // Use response.json() if the backend returns JSON
        })
        .then(() => {
            console.log('Post created successfully'); // Log success
            setPosts([...posts, { ...newPost, comments: [] }]); // Add the new post to the state
            setTitle('');
            setDescription('');
            setShowPopup(false);
        })
        .catch(error => {
            console.error('Error creating discussion:', error);
            alert('Failed to create discussion. Please try again.');
        });
        
        setTitle("");
        setDescription("");
        setShowPopup(false);
    };

    const addComment = (postId) => {
        if (!commentText.trim()) return;
        const newComment = {
            text: commentText,
            author: username, 
            createdAt: new Date().toLocaleDateString(),
        };
        fetch('/addComment', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ discussionId: postId, comment: newComment }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add comment');
                }
                return response.text();
            })
            .then(() => {
                setPosts(posts.map(post => {
                    if (post._id === postId) {
                        return { ...post, comments: [...post.comments, newComment] };
                    }
                    return post;
                }));
                setCommentText('');
            })
            .catch(error => {
                console.error('Error adding comment:', error);
                alert('Failed to add comment. Please try again.');
            });
    };

    return (
        <div style={styles.container}>
            <Navbar />
            {/* Main Content */}
            <div style={styles.content}>
                <div style={styles.discussionsHeader}>
                    <h2 style={styles.heading}>Discussions</h2>
                    <button 
                        style={styles.newPostBtn} 
                        onClick={() => setShowPopup(true)}
                    >
                        + New Post
                    </button>
                </div>
                <div style={styles.divider}></div>
                
                {/* Display posts */}
                <div>
                    {posts.map(post => (
                        <div key={post._id}>
                            <div 
                                style={{...styles.discussionCard, marginBottom: showComments === post._id ? '0' : '20px'}}
                                onClick={() => setShowComments(showComments === post._id ? null : post._id)}
                            >
                                <div style={styles.discussionContent}>
                                    <h3 style={styles.postTitle}>{post.title}</h3>
                                    <p style={styles.postDescription}>{post.description}</p>
                                    <div style={styles.postFooter}>
                                    <div style={styles.posterInfo}>
                                        <span style={styles.posterLabel}> Author: {post.posterName}</span> 
                                    </div>
                                    <div style={styles.commentsCount}>{post.comments.length} comments</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Comments section - only visible when clicked */}
                            {showComments === post._id && (
                                <div style={styles.commentsSection}>
                                    <h3 style={styles.commentsTitle}>Comments</h3>
                                    
                                    {post.comments.length === 0 ? (
                                        <p style={styles.noComments}>No comments yet. Be the first to comment!</p>
                                    ) : (
                                        <div style={styles.commentsList}>
                                            {post.comments.map((comment, index) => (
                                                <div key={index} style={styles.commentCard}>
                                                    <p><strong>{comment.author}</strong>: {comment.text}</p>
                                                    <p style={styles.commentDate}>{comment.createdAt}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Add comment form */}
                                    <div style={styles.addCommentForm}>
                                        <textarea 
                                            style={styles.commentTextarea} 
                                            placeholder="Add a comment..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                        />
                                        <button 
                                            style={styles.addCommentBtn}
                                            onClick={() => addComment(post._id)}
                                        >
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                {/* New Post Popup Form */}
                {showPopup && (
                    <div style={styles.popupOverlay}>
                        <div style={styles.popupContent}>
                            <h2 style={styles.popupTitle}>Create New Post</h2>
                            <form onSubmit={handleSubmit}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Title:</label>
                                    <input 
                                        type="text" 
                                        style={styles.input} 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Description:</label>
                                    <textarea 
                                        style={styles.textarea} 
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>
                                <div style={styles.buttonGroup}>
                                    <button 
                                        type="button" 
                                        style={styles.cancelBtn} 
                                        onClick={() => setShowPopup(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" style={styles.submitBtn}>
                                        Create Post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// CSS-in-JS styling
const styles = {
    container: {
        maxWidth: '100%',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'white',
    },
    content: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    discussionsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    heading: {
        fontSize: '1.8rem',
        color: '#1a1a2e',
        fontWeight: '500',
    },
    newPostBtn: {
        backgroundColor: '#1a1a2e',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: '500',
    },
    divider: {
        height: '1px',
        backgroundColor: '#e0e0e0',
        marginBottom: '20px',
    },
    discussionCard: {
        backgroundColor: '#2a2a36',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        padding: '15px 20px',
    },
    discussionContent: {
        color: 'white',
    },
    postTitle: {
        margin: '0 0 8px 0',
        fontSize: '1.2rem',
        color: 'white',
    },
    postDescription: {
        color: '#aaa',
        marginBottom: '10px',
        fontSize: '0.9rem',
    },
    postFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.9rem',
    },
posterInfo: {
    display: 'flex',
    alignItems: 'center',
},
posterLabel: {
    color: '#ddd',
},
required: {
    color: '#4a90e2',
    marginLeft: '4px',
},
    commentsCount: {
        color: '#aaa',
    },
    
    // Comments section styling
    commentsSection: {
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '0 0 8px 8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    commentsTitle: {
        color: '#333',
        fontSize: '1.2rem',
        marginBottom: '16px',
    },
    noComments: {
        color: '#888',
        fontStyle: 'italic',
        marginBottom: '20px',
    },
    commentsList: {
        marginBottom: '20px',
    },
    commentCard: {
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '10px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    commentHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
    },
    commentAuthor: {
        fontWeight: 'bold',
        color: '#333',
    },
    commentDate: {
        color: '#888',
        fontSize: '0.9rem',
    },
    commentText: {
        color: '#333',
        margin: '0',
    },
    addCommentForm: {
        marginTop: '20px',
    },
    commentTextarea: {
        width: '100%',
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        marginBottom: '10px',
        resize: 'vertical',
        minHeight: '80px',
        fontSize: '0.9rem',
        boxSizing: 'border-box',
    },
    addCommentBtn: {
        backgroundColor: '#4a90e2',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        fontSize: '0.9rem',
        cursor: 'pointer',
    },
    
    // Popup Styles
    popupOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popupContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '500px',
        maxWidth: '90%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    popupTitle: {
        margin: '0 0 20px 0',
        fontSize: '1.5rem',
        color: '#333',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        fontSize: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        minHeight: '100px',
        resize: 'vertical',
        boxSizing: 'border-box',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    },
    cancelBtn: {
        padding: '10px 20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: 'white',
        color: '#333',
        fontSize: '1rem',
        cursor: 'pointer',
    },
    submitBtn: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#4a90e2',
        color: 'white',
        fontSize: '1rem',
        cursor: 'pointer',
    },
};

export default Discussions;