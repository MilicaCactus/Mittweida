import React, { useState, useEffect } from 'react';
import './Profile.css';
import CatImage from "../assets/Cat.jpg";
import Saved from './saved';
import { useAuth } from './hooks/LoginProvider';
import { supabase } from '@/lib/supabase';
import PostComponent from './PostComponent';

export const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'notebook'>('posts');

    const {user, guard} = useAuth();
    const [bio, setBio] = useState('');
    const [editingBio, setEditingBio] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);
    useEffect(() => {
        
        async function fetchPosts() {
            if (!user) await fetchPosts();
            const {data, error} = await supabase.from("posts").select("*").eq("user_id", user!.id);
            if (data) {
                setPosts(data);
            } else {
                console.error("Error fetching posts:", error);
            }
        }
        guard(async()=>{
            await fetchPosts();
        })();
    }, [user]);
    useEffect(() => {
        const storedBio = localStorage.getItem('bio');
        if (storedBio) setBio(storedBio);
    }, []);

    const handleSaveBio = () => {
        localStorage.setItem('bio', bio);
        setEditingBio(false);
    };

    // Notebook state
    const [notes, setNotes] = useState<any[]>([]);
    const [form, setForm] = useState({ title: '', description: '', location: '', date: '' });
    const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', location: '', date: '' });

    useEffect(() => {
        const stored = localStorage.getItem('notes');
        if (stored) setNotes(JSON.parse(stored));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddNote = () => {
        const updated = [...notes, form];
        setNotes(updated);
        localStorage.setItem('notes', JSON.stringify(updated));
        setForm({ title: '', description: '', location: '', date: '' });
    };

    const handleEditNote = (index: number) => {
        setEditingNoteIndex(index);
        setEditForm(notes[index]);
    };

    const handleSaveEditedNote = () => {
        const updatedNotes = [...notes];
        if (editingNoteIndex !== null) {
            updatedNotes[editingNoteIndex] = editForm;
            setNotes(updatedNotes);
            localStorage.setItem('notes', JSON.stringify(updatedNotes));
            setEditingNoteIndex(null);
        }
    };

    const handleDeleteNote = (index: number) => {
        const updated = [...notes];
        updated.splice(index, 1);
        setNotes(updated);
        localStorage.setItem('notes', JSON.stringify(updated));
    };

    return (
        <div className="profile-wrapper">
            {/* Cover + Avatar */}
            <div className="cover-section">
                <div className="avatar-wrapper">
                    <img src={CatImage} alt="Cat" className="profile-avatar" />
                </div>
            </div>

            {/* Name + Editable Bio */}
            <div className="name">Profile</div>
            <div className="bio-card">
                {editingBio ? (
                    <>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about you..."
                            className="bio-textarea"
                            rows={3}
                        />
                        <br />
                        <button onClick={handleSaveBio} className="save-button">Save</button>
                    </>
                ) : (
                    <p className="bio-text" onClick={() => setEditingBio(true)}>
                        {bio || 'Click to add your bio'}
                    </p>
                )}
            </div>

            {/* Icons */}
            <div className="tab-icons">
                <span className="tab-icon" onClick={() => setActiveTab('posts')}>📄</span>
                <span className="tab-icon" onClick={() => setActiveTab('saved')}>🏷️</span>
                <span className="tab-icon" onClick={() => setActiveTab('notebook')}>🗒️</span>
            </div>

            {/* Tab content */}
            <div className="tab-content">
                {activeTab === 'posts' && (
                    <div className="posts-section">
                        <h3 className="center-text font-medium">Your Posts</h3>
                        {posts.length === 0 && <p className="center-text text-sm font-light">No posts yet.</p>}
                        {
                            posts.map((post, index) => {
                                return (
                                    <PostComponent post={post} key={index} index={index} visibleDescriptions={Array(posts.length).fill(false)} onClick={() => {}} />
                                );
                            })
                        }
                    </div>
                )}

                {activeTab === 'saved' && (
                    <div className="saved-section">
                        <Saved />
                    </div>
                )}

                {activeTab === 'notebook' && (
                    <div className="notebook-tab">
                        <h3 className="center-text notebook-heading">Your Notes, Thoughts, Blogs…</h3>

                        {/* New Note Form */}
                        <div className="note-form">
                            <input
                                name="title"
                                placeholder="Headline"
                                value={form.title}
                                onChange={handleChange}
                            />
                            <textarea
                                name="description"
                                placeholder="Write your thoughts..."
                                value={form.description}
                                onChange={handleChange}
                            />
                            <input
                                name="location"
                                placeholder="Location"
                                value={form.location}
                                onChange={handleChange}
                            />
                            <input
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                            />
                            <button onClick={handleAddNote}>Save Note</button>
                        </div>

                        {/* Notes Display */}
                        <div className="note-list">
                            {notes.map((note, index) => (
                                <div className="note-card" key={index}>
                                    {editingNoteIndex === index ? (
                                        <>
                                            <input
                                                name="title"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                placeholder="Headline"
                                            />
                                            <textarea
                                                name="description"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                placeholder="Details..."
                                            />
                                            <input
                                                name="location"
                                                value={editForm.location}
                                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                placeholder="Location"
                                            />
                                            <input
                                                type="date"
                                                name="date"
                                                value={editForm.date}
                                                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                            />
                                            <div className="note-actions">
                                                <button onClick={handleSaveEditedNote}>💾 Save</button>
                                                <button onClick={() => setEditingNoteIndex(null)}>❌ Cancel</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h4>{note.title}</h4>
                                            <p>{note.description}</p>
                                            <small>📍 {note.location} — 📅 {note.date}</small>
                                            <div className="note-actions">
                                                <button onClick={() => handleEditNote(index)}>✏️ Edit</button>
                                                <button onClick={() => handleDeleteNote(index)}>🗑️ Delete</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
