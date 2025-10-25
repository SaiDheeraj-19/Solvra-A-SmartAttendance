import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { attendanceService } from '../../services/attendanceService';
import { Camera, Upload, Trash2, Eye, Search, User } from 'lucide-react';
import toast from 'react-hot-toast';

const FaceManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('camera'); // 'camera' or 'file'
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStudentFaces();
  }, []);

  const fetchStudentFaces = async () => {
    try {
      const response = await attendanceService.getStudentFaces();
      setStudents(response.data.students || []);
    } catch (error) {
      toast.error('Failed to fetch student face data');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFace = async (faceData) => {
    if (!selectedStudent) return;

    try {
      await attendanceService.uploadStudentFace(selectedStudent._id, faceData);
      toast.success('Face data uploaded successfully');
      setShowUploadModal(false);
      setSelectedStudent(null);
      fetchStudentFaces();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to upload face data');
    }
  };

  const captureFace = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      handleUploadFace(imageSrc);
    } else {
      toast.error('Failed to capture image');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleUploadFace(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteFaceData = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student\'s face data?')) return;

    try {
      await attendanceService.deleteStudentFace(studentId);
      toast.success('Face data deleted successfully');
      fetchStudentFaces();
    } catch (error) {
      toast.error('Failed to delete face data');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Face Data Management</h3>
        <div className="text-sm text-gray-600">
          {students.filter(s => s.faceData?.encoding).length} of {students.length} students have face data
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student._id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{student.name}</h4>
                <p className="text-xs text-gray-500">{student.email}</p>
                {student.studentId && (
                  <p className="text-xs text-gray-400">ID: {student.studentId}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {/* Face Data Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Face Data:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  student.faceData?.encoding 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {student.faceData?.encoding ? 'Registered' : 'Not Registered'}
                </span>
              </div>

              {student.faceData?.registeredAt && (
                <div className="text-xs text-gray-500">
                  Registered: {new Date(student.faceData.registeredAt).toLocaleDateString()}
                </div>
              )}

              {student.faceData?.verificationCount && (
                <div className="text-xs text-gray-500">
                  Verifications: {student.faceData.verificationCount}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowUploadModal(true);
                  }}
                  className="flex-1 btn btn-primary text-xs flex items-center justify-center space-x-1"
                >
                  <Camera className="h-3 w-3" />
                  <span>{student.faceData?.encoding ? 'Update' : 'Upload'}</span>
                </button>

                {student.faceData?.encoding && (
                  <button
                    onClick={() => deleteFaceData(student._id)}
                    className="btn btn-danger text-xs flex items-center justify-center"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No students found</h4>
          <p className="text-gray-600">
            {searchTerm ? 'No students match your search criteria' : 'No students registered in the system'}
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Upload Face Data for {selectedStudent.name}
            </h3>

            {/* Upload Method Selection */}
            <div className="mb-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setUploadMethod('camera')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                    uploadMethod === 'camera'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  <Camera className="h-4 w-4 mx-auto mb-1" />
                  Camera
                </button>
                <button
                  onClick={() => setUploadMethod('file')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                    uploadMethod === 'file'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  <Upload className="h-4 w-4 mx-auto mb-1" />
                  File Upload
                </button>
              </div>
            </div>

            {/* Camera Capture */}
            {uploadMethod === 'camera' && (
              <div className="space-y-4">
                <div className="relative mx-auto w-64 h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={captureFace}
                  className="w-full btn btn-primary"
                >
                  Capture Face
                </button>
              </div>
            )}

            {/* File Upload */}
            {uploadMethod === 'file' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 btn btn-secondary text-sm"
                  >
                    Choose File
                  </button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h5 className="text-sm font-medium text-blue-900 mb-1">Guidelines:</h5>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Ensure good lighting and clear face visibility</li>
                <li>• Face should be looking directly at the camera</li>
                <li>• Remove glasses or accessories if possible</li>
                <li>• Use high-quality images for better recognition</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedStudent(null);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceManagement;