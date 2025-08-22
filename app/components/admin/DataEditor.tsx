'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, FileText } from 'lucide-react';

interface DataEditorProps {
  token: string;
  onLogout: () => void;
}

interface DataFile {
  name: string;
  path: string;
  content: any;
  sha?: string;
}

export default function DataEditor({ token, onLogout }: DataEditorProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileData, setFileData] = useState<DataFile | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const apiHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/admin/data', {
        headers: apiHeaders,
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
        if (data.files.length > 0 && !selectedFile) {
          setSelectedFile(data.files[0]);
        }
      } else if (response.status === 401) {
        onLogout();
      }
    } catch (error) {
      setError('Failed to load files');
    }
  };

  const loadFile = async (filename: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/data/${filename}`, {
        headers: apiHeaders,
      });

      if (response.ok) {
        const data = await response.json();
        setFileData(data);
        setEditedContent(JSON.stringify(data.content, null, 2));
      } else if (response.status === 401) {
        onLogout();
      } else {
        setError('Failed to load file');
      }
    } catch (error) {
      setError('Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  const saveFile = async () => {
    if (!fileData) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const content = JSON.parse(editedContent);

      const response = await fetch(`/api/admin/data/${selectedFile}`, {
        method: 'PUT',
        headers: apiHeaders,
        body: JSON.stringify({
          content,
          message: `Update ${selectedFile} via admin panel`,
          sha: fileData.sha,
        }),
      });

      if (response.ok) {
        setMessage('File saved successfully!');
        // Reload the file to get the new SHA
        await loadFile(selectedFile);
      } else if (response.status === 401) {
        onLogout();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save file');
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your syntax.');
      } else {
        setError('Failed to save file');
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      loadFile(selectedFile);
    }
  }, [selectedFile]);

  const isValidJson = () => {
    try {
      JSON.parse(editedContent);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Data Admin</h1>
            </div>
            <button
              onClick={onLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* File List */}
            <div className="lg:col-span-1">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Data Files
                  </h3>
                  <div className="space-y-2">
                    {files.map((file) => (
                      <button
                        key={file}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${selectedFile === file
                          ? 'bg-red-100 text-red-700'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {file}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={loadFiles}
                    className="mt-4 w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="lg:col-span-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedFile ? `Editing: ${selectedFile}` : 'Select a file'}
                    </h3>
                    {selectedFile && (
                      <button
                        onClick={saveFile}
                        disabled={saving || !isValidJson() || loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    )}
                  </div>

                  {message && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-green-800">{message}</p>
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-800">{error}</p>
                    </div>
                  )}

                  {loading ? (
                    <div className="flex items-center justify-center h-96">
                      <div className="text-gray-500">Loading...</div>
                    </div>
                  ) : selectedFile ? (
                    <div>
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className={`w-full h-96 p-4 border rounded-md font-mono text-sm ${isValidJson() ? 'border-gray-300' : 'border-red-300 bg-red-50'
                          }`}
                        placeholder="JSON content..."
                      />
                      {!isValidJson() && (
                        <p className="mt-2 text-sm text-red-600">
                          Invalid JSON format. Please check your syntax.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-96 text-gray-500">
                      Select a file from the left panel to start editing
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}