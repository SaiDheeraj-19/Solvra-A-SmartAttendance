const User = require('../models/User');

// Delete face data for a student (admin only)
exports.deleteFaceData = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId) {
      return res.status(400).json({ msg: 'Student ID is required' });
    }

    // Verify admin permissions
    if (!['admin', 'hod', 'dean'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Not authorized to perform this action' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Remove face data
    student.faceData = null;
    await student.save();

    res.json({
      success: true,
      message: 'Face data deleted successfully'
    });

  } catch (error) {
    console.error('Admin face data deletion error:', error);
    res.status(500).json({ msg: 'Error deleting face data' });
  }
};

// Get all students with face registration status
exports.getAllStudentsFaceStatus = async (req, res) => {
  try {
    // Verify admin permissions
    if (!['admin', 'hod', 'dean'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Not authorized to perform this action' });
    }

    const students = await User.find({ role: 'student' }).select('name studentId department email faceData');
    
    const studentsWithFaceStatus = students.map(student => ({
      _id: student._id,
      name: student.name,
      studentId: student.studentId,
      department: student.department,
      email: student.email,
      hasRegisteredFace: !!student.faceData?.encoding,
      faceRegisteredAt: student.faceData?.registeredAt
    }));

    res.json(studentsWithFaceStatus);

  } catch (error) {
    console.error('Get all students face status error:', error);
    res.status(500).json({ msg: 'Error getting students face status' });
  }
};