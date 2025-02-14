import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDiaryEntries } from '../services/diaryServices';
import { useUserContext } from '../context/UserContext';

const DiaryList: React.FC = () => {
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useUserContext();

    useEffect(() => {
        const fetchDiaryEntries = async () => {
            try {
                setIsLoading(true);
                const response = await getDiaryEntries(token!); // Pass token here
                setDiaryEntries(response);
            } catch (error) {
                console.error('Error fetching diary entries:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDiaryEntries();
    }, [token]);

    return (
        <div>
            <h2>Diary Entries</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {diaryEntries.map((entry: any) => (
                        <li key={entry.id}>
                            <Link to={`/diary-form/edit/${entry.id}`}>{entry.date}&nbsp;Weather: {entry.weather}&nbsp;Visibility: {entry.visibility}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DiaryList;
