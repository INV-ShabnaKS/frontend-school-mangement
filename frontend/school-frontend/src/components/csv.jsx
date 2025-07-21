import React, { useState } from 'react';
import api from '../api/axios';

const CSVImport = ({onUpload}) =>{
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleUpload = async () => {
        if (!selectedFile) {
            console.log("Selected file:", selectedFile);
            setMessage('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
        const response = await api.post('/students/import-csv/', formData);

        setMessage(response.data.message || 'Upload successful');
        if (onUpload) {
                onUpload();  
            }

        } catch (error) {
            const backendErrors = error.response?.data?.errors;
            const backendMessage = error.response?.data?.message;

            if (backendErrors && backendErrors.length > 0) {
                setMessage(`${backendMessage}\nErrors:\n${backendErrors.join('\n')}`);
            } else {
                setMessage('Upload failed');
            }
        }


    };
    return (
        <div>
            <input type="file" accept=".csv" onChange={(e) => setSelectedFile(e.target.files[0])}/>
            <button onClick={handleUpload}>Upload CSV</button>
            {message && <p>{message}</p>}
        </div>
    );
};
export default CSVImport;