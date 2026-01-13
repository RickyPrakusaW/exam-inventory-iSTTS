import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Upload, RefreshCw, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';

const BackupPage = () => {
    const [connected, setConnected] = useState(false);
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [restoring, setRestoring] = useState(false);
    const [backuping, setBackuping] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        checkStatus();
        
        // Handle OAuth callback logic if redirected from Google
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            handleOAuthCallback(code);
        }
    }, []);

    const checkStatus = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/backup/status');
            setConnected(res.data.connected);
            if (res.data.connected) {
                fetchBackups();
            }
        } catch (error) {
            console.error('Error checking status:', error);
        }
    };

    const fetchBackups = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/backup/list');
            setBackups(res.data.files || []);
        } catch (error) {
            console.error('Error fetching backups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/backup/auth/url');
            window.location.href = res.data.url;
        } catch (error) {
            console.error('Error getting auth url:', error);
            setMessage({ type: 'error', text: 'Failed to initiate connection.' });
        }
    };

    const handleOAuthCallback = async (code) => {
        try {
            await axios.post('http://localhost:5000/api/backup/auth/callback', { code });
            setMessage({ type: 'success', text: 'Connected to Google Drive successfully!' });
            setConnected(true);
            window.history.replaceState({}, document.title, window.location.pathname); // Clean URL
            fetchBackups();
        } catch (error) {
            console.error('Error handling callback:', error);
            setMessage({ type: 'error', text: 'Failed to connect to Google Drive.' });
        }
    };

    const handleBackup = async () => {
        setBackuping(true);
        setMessage({ type: '', text: '' });
        try {
            await axios.post('http://localhost:5000/api/backup/create');
            setMessage({ type: 'success', text: 'Backup created successfully!' });
            fetchBackups();
        } catch (error) {
            console.error('Backup error:', error);
            setMessage({ type: 'error', text: 'Backup failed. Check server logs.' });
        } finally {
            setBackuping(false);
        }
    };

    const handleRestore = async (fileId) => {
        if (!window.confirm('WARNING: This will overwrite proper existing data! Are you sure?')) return;
        
        setRestoring(true);
        setMessage({ type: '', text: '' });
        try {
            await axios.post(`http://localhost:5000/api/backup/restore/${fileId}`);
            setMessage({ type: 'success', text: 'System restored successfully!' });
        } catch (error) {
            console.error('Restore error:', error);
            setMessage({ type: 'error', text: 'Restore failed. Check server logs.' });
        } finally {
            setRestoring(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Backup & Restore</h1>
                    <p className="text-gray-500 mt-1">Manage system backups with Google Drive</p>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                    message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <p>{message.text}</p>
                </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${connected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                            <Cloud size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-800">
                                {connected ? 'Connected to Google Drive' : 'Not Connected'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {connected ? 'System is ready to perform backups.' : 'Connect to Google Drive to enable backups.'}
                            </p>
                        </div>
                    </div>
                    
                    {!connected ? (
                        <button
                            onClick={handleConnect}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Cloud size={18} />
                            Connect Drive
                        </button>
                    ) : (
                        <button
                            onClick={handleBackup}
                            disabled={backuping}
                            className="bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            {backuping ? <RefreshCw size={18} className="animate-spin" /> : <Upload size={18} />}
                            {backuping ? 'Backing up...' : 'Backup Now'}
                        </button>
                    )}
                </div>

                {connected && (
                    <div className="mt-8">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Clock size={18} />
                            Backup History
                        </h3>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                <div className="flex justify-center items-center gap-2">
                                                    <RefreshCw size={18} className="animate-spin" />
                                                    Loading backups...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : backups.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                No backups found.
                                            </td>
                                        </tr>
                                    ) : (
                                        backups.map((file) => (
                                            <tr key={file.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {file.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(file.createdTime).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {file.size && parseInt(file.size) > 0 ? (parseInt(file.size) / (1024 * 1024)).toFixed(2) + ' MB' : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleRestore(file.id)}
                                                        disabled={restoring}
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:text-gray-400"
                                                    >
                                                        {restoring ? 'Restoring...' : 'Restore'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BackupPage;
