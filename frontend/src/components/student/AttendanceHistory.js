import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const AttendanceHistory = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchAttendanceHistory();
  }, [filters]);

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getAttendanceHistory(filters);
      setAttendanceHistory(response.data.attendance || []);
      
      // Extract unique subjects for filter dropdown
      const uniqueSubjects = [...new Set(response.data.attendance?.map(record => record.subject) || [])];
      setSubjects(uniqueSubjects);
    } catch (error) {
      toast.error('Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'late':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'text-green-600 bg-green-100';
      case 'absent':
        return 'text-red-600 bg-red-100';
      case 'late':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

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
        <h3 className="text-lg font-medium text-gray-900">Attendance History</h3>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {attendanceHistory.length} records
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={clearFilters}
            className="btn btn-secondary text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Attendance Records */}
      {attendanceHistory.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h4>
          <p className="text-gray-600">
            {Object.values(filters).some(f => f) 
              ? 'No records match your current filters'
              : 'You haven\'t marked any attendance yet'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {attendanceHistory.map((record, index) => (
            <div key={record._id || index} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(record.status)}
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {record.subject || 'Unknown Subject'}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {record.date ? format(parseISO(record.date), 'MMM dd, yyyy') : 'Unknown Date'}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {record.time || 'Unknown Time'}
                      </div>
                      {record.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Campus
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                    {record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : 'Unknown'}
                  </span>
                  
                  {record.markedAt && (
                    <div className="text-xs text-gray-500">
                      Marked: {format(parseISO(record.markedAt), 'HH:mm')}
                    </div>
                  )}
                </div>
              </div>

              {record.faculty && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Faculty: <span className="font-medium text-gray-900">{record.faculty}</span>
                    </span>
                    {record.sessionId && (
                      <span className="text-gray-500">
                        Session: {record.sessionId.slice(-8)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;