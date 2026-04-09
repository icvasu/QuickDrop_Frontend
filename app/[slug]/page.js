'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Download, Trash2, Lock, Unlock, File, Copy, Upload, Edit, X } from 'lucide-react';
import { 
  getFileInfo, 
  uploadFile, 
  downloadFileById, 
  deleteFileById, 
  lockPage, 
  unlockPage,
  saveTextContent,
  getTextContent,
  verifyPassword
} from '@/lib/api';

export default function CombinedPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  // Page state
  const [loading, setLoading] = useState(true);
  const [pageExists, setPageExists] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPageOwner, setIsPageOwner] = useState(false);

  // Text area state
  const [textContent, setTextContent] = useState('');
  const [originalTextContent, setOriginalTextContent] = useState('');
  const [textHasChanges, setTextHasChanges] = useState(false);

  // Files state
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // UI state
  const [showLockModal, setShowLockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUnlockConfirmModal, setShowUnlockConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  // Password popup for actions
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [actionPassword, setActionPassword] = useState('');
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchPageInfo();
    }
  }, [slug]);

  useEffect(() => {
    setTextHasChanges(textContent !== originalTextContent);
  }, [textContent, originalTextContent]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchPageInfo = async () => {
    try {
      const info = await getFileInfo(slug);
      setPageExists(true);
      setIsLocked(info.is_locked || false);
      
      setFiles(info.files || []);
      
      try {
        const textData = await getTextContent(slug);
        setTextContent(textData.textContent || '');
        setOriginalTextContent(textData.textContent || '');
      } catch (err) {
        setTextContent('');
        setOriginalTextContent('');
      }

    } catch (err) {
      if (err.response?.status === 404) {
        console.log('New page - will be created on first save');
        setPageExists(true);
        setIsLocked(false);
        setFiles([]);
        setTextContent('');
        setOriginalTextContent('');
      } else {
        setPageExists(false);
        setError('Page not found or expired');
      }
    } finally {
      setLoading(false);
    }
  };

  const requiresPassword = () => {
    return isLocked && !isAuthenticated;
  };

  const requestPassword = (action, data = null) => {
    setPendingAction({ action, data });
    setActionPassword('');
    setShowPasswordPopup(true);
  };

  const handlePasswordSubmit = async () => {
    if (!actionPassword) {
      showNotification('Please enter a password', 'error');
      return;
    }

    try {
      await verifyPassword(slug, actionPassword);
      
      setIsAuthenticated(true);
      setShowPasswordPopup(false);
      showNotification('Access granted!', 'success');
      
      if (pendingAction) {
        executePendingAction();
      }
      
    } catch (error) {
      showNotification('Incorrect password', 'error');
    }
  };

  const executePendingAction = () => {
    if (!pendingAction) return;

    const { action, data } = pendingAction;

    switch (action) {
      case 'save_text':
        handleSaveTextDirect();
        break;
      case 'upload':
        handleUploadDirect();
        break;
      case 'download':
        handleDownloadDirect(data);
        break;
      case 'delete':
        setFileToDelete(data);
        setShowDeleteModal(true);
        break;
    }

    setPendingAction(null);
  };

  const handleTextAreaClick = () => {
    if (requiresPassword()) {
      requestPassword('edit_text');
    }
  };

  const handleTextChange = (e) => {
    if (requiresPassword()) {
      requestPassword('edit_text');
      return;
    }
    setTextContent(e.target.value);
  };

  const handleSaveText = async () => {
    if (requiresPassword()) {
      requestPassword('save_text');
      return;
    }
    await handleSaveTextDirect();
  };

  const handleSaveTextDirect = async () => {
    try {
      await saveTextContent(slug, textContent);
      setOriginalTextContent(textContent);
      showNotification('Document successfully saved!', 'success');
    } catch (error) {
      console.error('Save text error:', error);
      showNotification('Failed to save text content', 'error');
    }
  };

  const handleCopyText = () => {
    if (textContent.trim()) {
      navigator.clipboard.writeText(textContent);
      showNotification('Text copied to clipboard!', 'info');
    }
  };

  const handleClearText = () => {
    if (requiresPassword()) {
      requestPassword('edit_text');
      return;
    }
    setTextContent('');
  };

  const handleFileSelect = (e) => {
    if (requiresPassword()) {
      requestPassword('upload');
      e.target.value = '';
      return;
    }
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (requiresPassword()) {
      requestPassword('upload');
      return;
    }
    await handleUploadDirect();
  };

  const handleUploadDirect = async () => {
    if (selectedFiles.length === 0) {
      showNotification('Please select files to upload', 'error');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('slug', slug);

      await uploadFile(formData);
      
      showNotification(`${selectedFiles.length} file(s) uploaded successfully!`, 'success');
      setSelectedFiles([]);
      
      await fetchPageInfo();
    } catch (error) {
      console.error('Upload error:', error);
      showNotification('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (file) => {
    if (requiresPassword()) {
      requestPassword('download', file);
      return;
    }
    await handleDownloadDirect(file);
  };

  const handleDownloadDirect = async (file) => {
    try {
      const response = await downloadFileById(file.id, isLocked ? password : null);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.original_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showNotification('File downloaded successfully!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showNotification('Download failed', 'error');
    }
  };

  const handleDeleteClick = (file) => {
    if (requiresPassword()) {
      requestPassword('delete', file);
      return;
    }
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteFileById(fileToDelete.id);
      showNotification('File deleted successfully!', 'success');
      setShowDeleteModal(false);
      setFileToDelete(null);
      await fetchPageInfo();
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Failed to delete file', 'error');
    }
  };

  const handleLockButtonClick = () => {
    if (!isLocked) {
      setShowLockModal(true);
    } else if (isAuthenticated) {
      setShowUnlockConfirmModal(true);
    } else {
      setShowEditModal(true);
    }
  };

  const handleLockConfirm = async () => {
    if (!password) {
      showNotification('Please enter a password', 'error');
      return;
    }

    try {
      await lockPage(slug, password);
      setIsLocked(true);
      setIsAuthenticated(true);
      setIsPageOwner(true);
      setShowLockModal(false);
      setPassword('');
      showNotification('Domain locked and saved successfully!', 'success');
    } catch (error) {
      console.error('Lock error:', error);
      showNotification('Failed to lock page', 'error');
    }
  };

  const handleEditUnlock = async () => {
    if (!password) {
      showNotification('Please enter a password', 'error');
      return;
    }

    try {
      await verifyPassword(slug, password);
      
      setIsAuthenticated(true);
      setIsPageOwner(false);
      setShowEditModal(false);
      setPassword('');
      showNotification('Access granted! You can now edit.', 'success');
    } catch (error) {
      showNotification('Incorrect password', 'error');
    }
  };

  const confirmPermanentUnlock = async () => {
    if (!password) {
      showNotification('Please enter your password', 'error');
      return;
    }

    try {
      await unlockPage(slug, password);
      setIsLocked(false);
      setIsAuthenticated(false);
      setIsPageOwner(false);
      setPassword('');
      setShowUnlockConfirmModal(false);
      showNotification('Page permanently unlocked!', 'success');
      await fetchPageInfo();
    } catch (error) {
      console.error('Unlock error:', error);
      showNotification('Incorrect password or unlock failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!pageExists) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-red-500">
          <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const getLockButtonLabel = () => {
    if (!isLocked) {
      return { icon: <Lock className="w-5 h-5" />, text: 'Lock' };
    } else if (isAuthenticated) {
      return { icon: <Unlock className="w-5 h-5" />, text: 'Unlock' };
    } else {
      return { icon: <Edit className="w-5 h-5" />, text: 'Edit' };
    }
  };

  const buttonLabel = getLockButtonLabel();

  return (
    <div className="min-h-screen bg-black text-white p-3 md:p-4 lg:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-3 md:mb-4">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 md:px-6 md:py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors text-sm md:text-base"
        >
          Home
        </button>
      </div>

      {/* Main Content - FULLY RESPONSIVE with vh */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6 mb-3 md:mb-4">
        
        {/* TEXT AREA */}
        <div className="relative">
          <div className="bg-gray-900/50 border border-cyan-500/50 rounded-xl p-4 h-[40vh] md:h-[45vh] lg:h-[calc(100vh-200px)]">
            {/* Copy and Clear buttons */}
            <div className="absolute top-6 right-6 flex gap-2 z-10">
              {textContent.trim() && (
                <button
                  onClick={handleCopyText}
                  className="p-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy all text"
                >
                  <Copy className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
                </button>
              )}
              {textContent.trim() && (
                <button
                  onClick={handleClearText}
                  className="p-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Clear text"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-red-400" />
                </button>
              )}
            </div>

            <textarea
              value={textContent}
              onChange={handleTextChange}
              onClick={handleTextAreaClick}
              placeholder={
                requiresPassword() 
                  ? "🔒 Click here to unlock and edit..." 
                  : "Enter text and hit save button"
              }
              className={`w-full h-full bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none pr-20 ${
                requiresPassword() ? 'cursor-pointer' : ''
              }`}
              readOnly={requiresPassword()}
            />
          </div>
        </div>

        {/* FILE UPLOADS */}
        <div className="bg-gray-900/50 border border-cyan-500/50 rounded-xl p-4 h-[40vh] md:h-[45vh] lg:h-[calc(100vh-200px)] flex flex-col">
          
          {/* Uploaded Files Section */}
          <div className="flex-1 overflow-hidden flex flex-col mb-4">
            <h2 className="text-base md:text-lg font-bold text-white mb-2">
              Uploaded Files ({files.length})
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-2">
              {files.length === 0 ? (
                <div className="text-center py-4 md:py-8 text-gray-500">
                  <File className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs md:text-sm">No files uploaded yet</p>
                </div>
              ) : (
                files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-gray-800/80 border border-gray-700 rounded-lg p-2 md:p-3 flex items-center justify-between hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      <div className="p-1.5 md:p-2 bg-blue-600/20 rounded-lg">
                        <File className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate text-xs md:text-sm">
                          {file.original_name}
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          {(file.file_size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1.5 md:gap-2">
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-1.5 md:p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(file)}
                        className="p-1.5 md:p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ready to Upload Section */}
          {selectedFiles.length > 0 && (
            <div className="mb-3">
              <h3 className="text-xs md:text-sm font-semibold text-gray-400 mb-2">
                Ready to upload ({selectedFiles.length}):
              </h3>
              <div className="space-y-2 max-h-20 md:max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-2 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <File className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-xs md:text-sm text-white truncate">
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeSelectedFile(index)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div>
            {selectedFiles.length > 0 ? (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`w-full py-3 md:py-4 rounded-lg font-bold text-sm md:text-base text-white flex items-center justify-center gap-2 transition-all ${
                  uploading
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
                }`}
              >
                <Upload className="w-4 h-4 md:w-5 md:h-5" />
                {uploading ? 'Uploading...' : 'Upload File'}
              </button>
            ) : (
              <label className="block w-full cursor-pointer">
                <div className="w-full py-3 md:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg transition-all text-center font-bold text-sm md:text-base text-white flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4 md:w-5 md:h-5" />
                  Upload File
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      
      {/* Bottom Buttons - Side by side on all devices */}
        <div className="max-w-7xl mx-auto flex flex-row gap-2 md:gap-3 lg:gap-4">  
        <button
          onClick={handleSaveText}
          className="w-full py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          Save
        </button>

        <button
          onClick={handleLockButtonClick}
          className="w-full py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white"
        >
          {buttonLabel.icon}
          {buttonLabel.text}
        </button>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`rounded-lg shadow-lg p-4 flex items-center gap-3 ${
            notification.type === 'success' ? 'bg-green-600' :
            notification.type === 'error' ? 'bg-red-600' :
            'bg-blue-600'
          }`}>
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              {notification.type === 'success' && (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <span className="text-white font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Password Popup Modal */}
      {showPasswordPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-purple-100 rounded-2xl p-6 md:p-8 max-w-md w-full border border-purple-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Password Required
              </h3>
              <p className="text-sm md:text-base text-gray-700 mb-4">
                This page is locked. Enter password to continue.
              </p>
              <input
                type="password"
                placeholder="Enter Password"
                value={actionPassword}
                onChange={(e) => setActionPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white transition-colors text-sm md:text-base"
              >
                Submit
              </button>
              
              <button
                onClick={() => {
                  setShowPasswordPopup(false);
                  setPendingAction(null);
                  setActionPassword('');
                }}
                className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-gray-400 hover:bg-gray-500 rounded-lg font-bold text-white transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lock Modal */}
      {showLockModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-purple-100 rounded-2xl p-6 md:p-8 max-w-md w-full border border-purple-300">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Set Password for Lock
              </h3>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLockConfirm()}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 mb-4 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLockConfirm}
                className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-white transition-colors text-sm md:text-base"
              >
                Lock
              </button>
              
              <button
                onClick={() => {
                  setShowLockModal(false);
                  setPassword('');
                }}
                className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-gray-400 hover:bg-gray-500 rounded-lg font-bold text-white transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Unlock Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-purple-100 rounded-2xl p-6 md:p-8 max-w-md w-full border border-purple-300">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Enter Password to Unlock
              </h3>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEditUnlock()}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 mb-4 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleEditUnlock}
                className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-white transition-colors text-sm md:text-base"
              >
                Unlock
              </button>
              
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setPassword('');
                }}
                className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-gray-400 hover:bg-gray-500 rounded-lg font-bold text-white transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && fileToDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-purple-100 rounded-2xl p-6 md:p-8 max-w-md w-full border border-purple-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                Delete This File?
              </h3>
              <p className="text-sm md:text-base text-gray-700 font-medium mb-2">
                {fileToDelete.original_name}
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-white transition-colors text-sm md:text-base"
              >
                Yes, Delete
              </button>
              
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setFileToDelete(null);
                }}
                className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-gray-300 hover:bg-gray-400 rounded-lg font-bold text-gray-800 transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Unlock Modal */}
      {showUnlockConfirmModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-purple-100 rounded-2xl p-6 md:p-8 max-w-md w-full border border-purple-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Unlock className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                Permanently Unlock This Page?
              </h3>
              <p className="text-sm md:text-base text-gray-700 font-medium mb-2">
                All password protection will be removed.
              </p>
              <p className="text-xs md:text-sm text-gray-600 mb-4">
                Anyone will be able to access this page without a password.
              </p>
              <input
                type="password"
                placeholder="Confirm your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && confirmPermanentUnlock()}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmPermanentUnlock}
                className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-bold text-white transition-colors text-sm md:text-base"
              >
                Yes, Unlock
              </button>
              
              <button
                onClick={() => {
                  setShowUnlockConfirmModal(false);
                  setPassword('');
                }}
                className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-gray-300 hover:bg-gray-400 rounded-lg font-bold text-gray-800 transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}