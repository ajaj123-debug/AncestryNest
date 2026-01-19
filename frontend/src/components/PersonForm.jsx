import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';

const PersonForm = ({ parentId, personToEdit, onSuccess, onCancel }) => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('M');
    const [spouseName, setSpouseName] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [deathYear, setDeathYear] = useState('');
    const [profession, setProfession] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (personToEdit) {
            setName(personToEdit.name);
            setGender(personToEdit.gender || 'M');
            setSpouseName(personToEdit.spouse_name || '');
            setBirthYear(personToEdit.birth_year || '');
            setDeathYear(personToEdit.death_year || '');
            setProfession(personToEdit.profession || '');
            setNotes(personToEdit.notes || '');
        } else {
            // Reset for new entry
            setName('');
            setGender('M');
            setSpouseName('');
            setBirthYear('');
            setDeathYear('');
            setProfession('');
            setNotes('');
        }
    }, [personToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name,
            gender,
            spouse_name: spouseName || null,
            birth_year: birthYear || null,
            death_year: deathYear || null,
            profession,
            notes,
            // If editing, don't change parent. If creating, use parentId (which might be null for root)
            parent: personToEdit ? personToEdit.parent : parentId
        };

        try {
            if (personToEdit) {
                await apiClient.put(`people/${personToEdit.id}/`, payload);
            } else {
                await apiClient.post('people/', payload);
            }
            onSuccess();
        } catch (error) {
            console.error("Error saving person:", error);
            alert("Failed to save person.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this person? This will delete all descendants as well.")) return;
        try {
            await apiClient.delete(`people/${personToEdit.id}/`);
            onSuccess();
        } catch (error) {
            console.error("Error deleting person:", error);
            alert("Failed to delete person.");
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>{personToEdit ? 'Edit Person' : 'Add Family Member'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Gender:</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Spouse Name:</label>
                        <input value={spouseName} onChange={(e) => setSpouseName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Birth Year:</label>
                        <input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Death Year:</label>
                        <input type="number" value={deathYear} onChange={(e) => setDeathYear(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Profession:</label>
                        <input value={profession} onChange={(e) => setProfession(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Notes:</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>

                    <div className="buttons">
                        <button type="submit" className="save-btn">Save</button>
                        {personToEdit && <button type="button" onClick={handleDelete} className="delete-btn">Delete</button>}
                        <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PersonForm;
