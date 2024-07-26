import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TranslationManager = () => {
    const { id } = useParams();
    const [translations, setTranslations] = useState([]);
    const [newTranslationKey, setNewTranslationKey] = useState('');
    const [newTranslationValue, setNewTranslationValue] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTranslations();
    }, []);

    const fetchTranslations = async () => {
        try {
            const response = await axios.get(`/api/applications/${id}`);
            setTranslations(response.data.translations);
        } catch (error) {
            console.error('Error fetching translations', error);
        }
    };

    const addTranslation = async () => {
        try {
            const newTranslation = { translationKey: newTranslationKey, value: newTranslationValue };
            const response = await axios.post(`/api/applications/${id}/translations`, newTranslation);
            setTranslations([...translations, response.data]);
            setNewTranslationKey('');
            setNewTranslationValue('');
        } catch (error) {
            console.error('Error adding translation', error);
        }
    };

    return (
        <div>
            <h1>Manage Translations for App {id}</h1>
            <button onClick={() => navigate('/')}>Back to Applications</button>
            <div>
                <h2>Add Translation</h2>
                <input
                    type="text"
                    value={newTranslationKey}
                    onChange={(e) => setNewTranslationKey(e.target.value)}
                    placeholder="Translation key"
                />
                <input
                    type="text"
                    value={newTranslationValue}
                    onChange={(e) => setNewTranslationValue(e.target.value)}
                    placeholder="Translation value"
                />
                <button onClick={addTranslation}>Add</button>
            </div>
            <div>
                <h2>Existing Translations</h2>
                {translations.map((translation) => (
                    <div key={translation.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                        <p>{translation.translationKey}: {translation.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TranslationManager;
