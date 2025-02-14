import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDiaryEntryById, createDiaryEntry, updateDiaryEntry } from '../services/diaryServices';
import { useUserContext } from '../context/UserContext';
import { Visibility, Weather } from '../models/constants'; // Import enums

interface DiaryFormProps {
    mode: 'create' | 'edit';
}

interface DiaryEntry {
    id: string;
    date: string; // Assuming it's a string, adjust as needed
    weather: Weather;
    userId: string;
    comment: string;
    visibility: Visibility;
}

const DiaryForm: React.FC<DiaryFormProps> = ({ mode }) => {
    const { id } = useParams<{ id: string }>();
    const [diaryEntry, setDiaryEntry] = useState<DiaryEntry>({
        id: id || '', // ID is statically displayed
        date: '',
        weather: Weather.Sunny,
        userId: '',
        comment: '',
        visibility: Visibility.Great
    });
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useUserContext();

    useEffect(() => {
        const fetchData = async () => {
            if (mode === 'edit' && id) {
                try {
                    setIsLoading(true);
                    const response = await getDiaryEntryById(id!, token!);
                    setDiaryEntry(response);
                } catch (error) {
                    console.error('Error fetching diary entry:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
    }, [mode, id, token]);

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            if (mode === 'edit') {
                await updateDiaryEntry(id!, diaryEntry, token!);
                setAlertMessage('Diary entry updated successfully!');
            } else {
                await createDiaryEntry(diaryEntry, token!);
                setAlertMessage('Diary entry created successfully!');
            }
            setIsAlertVisible(true);
        } catch (error) {
            console.error('Error saving diary entry:', error);
            setAlertMessage('An error occurred while saving the diary entry.');
            setIsAlertVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isAlertVisible) {
            timer = setTimeout(() => {
                setIsAlertVisible(false);
                setAlertMessage(null);
            }, 5000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [isAlertVisible]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setDiaryEntry(prevEntry => ({
            ...prevEntry,
            [name]: value
        }));
    };

    return (
        <div>
            <h2>{id ? 'Edit Diary Entry' : 'Create Diary Entry'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID:</label>
                    <input type="text" value={diaryEntry.id} disabled />
                </div>
                <div>
                    <label>Date:</label>
                    <input type="date" name="date" value={diaryEntry.date} onChange={handleChange} />
                </div>
                <div>
                    <label>Comment:</label>
                    <input type="text" name="comment" value={diaryEntry.comment} onChange={handleChange} />
                </div>
                <div>
                    <label>Weather:</label>
                    <select name="weather" value={diaryEntry.weather} onChange={handleChange}>
                        {Object.values(Weather).map(weather => (
                            <option key={weather} value={weather}>{weather}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Visibility:</label>
                    <select name="visibility" value={diaryEntry.visibility} onChange={handleChange}>
                        {Object.values(Visibility).map(visibility => (
                            <option key={visibility} value={visibility}>{visibility}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={isLoading}>{isLoading ? 'Loading...' : 'Submit'}</button>
            </form>
            {isAlertVisible && <div className={`alert ${isAlertVisible ? '' : 'hidden'}`}>{alertMessage}</div>}
        </div>
    );
};

export default DiaryForm;
