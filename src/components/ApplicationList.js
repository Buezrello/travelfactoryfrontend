import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../App.css';

Modal.setAppElement('#root');

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const [newAppName, setNewAppName] = useState('');
    const [lastDeployment, setLastDeployment] = useState('');
    const [translations, setTranslations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await axios.get('/api/applications');
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications', error);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!newAppName) {
            errors.newAppName = 'Name is required';
        }

        const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        if (!lastDeployment.match(dateTimeRegex)) {
            errors.lastDeployment = 'Invalid date format. Expected format: yyyy-MM-dd HH:mm:ss';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const addApplication = async () => {
        if (!validateForm()) {
            return;
        }

        const newApplication = {
            name: newAppName,
            lastDeployment,
            translations,
        };

        try {
            const response = await axios.post('/api/applications', newApplication);
            setApplications([...applications, response.data]);
            closeModal();
        } catch (error) {
            console.error('Error adding application', error);
        }
    };

    const downloadTranslations = async (id) => {
        try {
            const response = await axios.get(`/api/applications/download/${id}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'translations.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading translations', error);
        }
    };

    const deployTranslations = async (id) => {
        try {
            await axios.post(`/api/applications/deploy/${id}`);
            alert('Deployment successful');
        } catch (error) {
            console.error('Error deploying translations', error);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setNewAppName('');
        setLastDeployment('');
        setTranslations([]);
        setErrors({});
    };

    const handleAddTranslation = () => {
        setTranslations([...translations, { translationKey: '', value: '' }]);
    };

    const handleTranslationChange = (index, key, value) => {
        const newTranslations = [...translations];
        newTranslations[index][key] = value;
        setTranslations(newTranslations);
    };

    const renderAddAppButton = () => {
        const isOdd = applications.length % 2 !== 0;
        return (
            <div
                className="add-app-button-container"
                style={{
                    alignSelf: isOdd ? 'flex-start' : 'center',
                }}
            >
                <button
                    className="add-app-button"
                    onClick={openModal}
                >
                    Add app
                </button>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="left-panel">
                <h2>My Apps</h2>
                {applications.map((app) => (
                    <div key={app.id} className="app-list-item">
                        {app.name}
                    </div>
                ))}
            </div>
            <div className="right-panel">
                <h1>Translator Manager</h1>
                <div className="cards-container">
                    {applications.map((app) => (
                        <div key={app.id} className="app-card">
                            <h3>{app.name}</h3>
                            <p>Last deployment: {app.lastDeployment}</p>
                            <button className="button" onClick={() => downloadTranslations(app.id)}>Download on XLSX</button>
                            <button className="button" onClick={() => deployTranslations(app.id)}>Deploy</button>
                        </div>
                    ))}
                    {renderAddAppButton()}
                </div>
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Add Application</h2>
                            <form onSubmit={(e) => { e.preventDefault(); addApplication(); }}>
                                <div>
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        value={newAppName}
                                        onChange={(e) => setNewAppName(e.target.value)}
                                        required
                                    />
                                    {errors.newAppName && <span className="error">{errors.newAppName}</span>}
                                </div>
                                <div>
                                    <label>Last Deployment</label>
                                    <input
                                        type="text"
                                        value={lastDeployment}
                                        onChange={(e) => setLastDeployment(e.target.value)}
                                        required
                                    />
                                    {errors.lastDeployment && <span className="error">{errors.lastDeployment}</span>}
                                </div>
                                <div>
                                    <h3>Translations</h3>
                                    {translations.map((translation, index) => (
                                        <div key={index}>
                                            <input
                                                type="text"
                                                placeholder="Translation Key"
                                                value={translation.translationKey}
                                                onChange={(e) => handleTranslationChange(index, 'translationKey', e.target.value)}
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Translation Value"
                                                value={translation.value}
                                                onChange={(e) => handleTranslationChange(index, 'value', e.target.value)}
                                                required
                                            />
                                        </div>
                                    ))}
                                    <button type="button" onClick={handleAddTranslation}>Add Translation</button>
                                </div>
                                <div>
                                    <button type="submit">Add Application</button>
                                    <button type="button" onClick={closeModal}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationList;
