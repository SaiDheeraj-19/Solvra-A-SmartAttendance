const Marks = require('../models/Marks');
const User = require('../models/User');

// Get marks analytics for a student
exports.getMarksAnalytics = async (req, res) => {
  try {
    const { semester, academicYear } = req.query;
    const studentId = req.user._id;

    // Build query
    const query = { student: studentId };
    if (semester) query.semester = parseInt(semester);
    if (academicYear) query.academicYear = academicYear;

    // Get marks data
    const marks = await Marks.find(query).sort({ semester: 1, subject: 1 });

    // Calculate analytics
    const analytics = await calculateMarksAnalytics(studentId, marks, query);

    res.json({
      success: true,
      analytics,
      marks: marks
    });

  } catch (error) {
    console.error('Marks analytics error:', error);
    res.status(500).json({ msg: 'Error fetching marks analytics' });
  }
};

// Get semester-wise summary
exports.getSemesterSummary = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    const semesterSummary = await Marks.aggregate([
      { $match: { student: studentId } },
      {
        $group: {
          _id: { semester: '$semester', academicYear: '$academicYear' },
          subjects: { $sum: 1 },
          totalCredits: { $sum: '$credits' },
          avgGPA: { $avg: '$gpa' },
          avgMarks: { $avg: '$totalMarks' },
          passedSubjects: {
            $sum: { $cond: [{ $gte: ['$totalMarks', 40] }, 1, 0] }
          },
          failedSubjects: {
            $sum: { $cond: [{ $lt: ['$totalMarks', 40] }, 1, 0] }
          },
          gradeDistribution: {
            $push: {
              subject: '$subject',
              grade: '$grade',
              gpa: '$gpa',
              totalMarks: '$totalMarks'
            }
          }
        }
      },
      { $sort: { '_id.academicYear': 1, '_id.semester': 1 } }
    ]);

    res.json({
      success: true,
      semesterSummary
    });

  } catch (error) {
    console.error('Semester summary error:', error);
    res.status(500).json({ msg: 'Error fetching semester summary' });
  }
};

// Get subject-wise performance
exports.getSubjectPerformance = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { semester } = req.query;

    const query = { student: studentId };
    if (semester) query.semester = parseInt(semester);

    const subjectPerformance = await Marks.find(query).sort({ totalMarks: -1 });

    res.json({
      success: true,
      subjectPerformance
    });

  } catch (error) {
    console.error('Subject performance error:', error);
    res.status(500).json({ msg: 'Error fetching subject performance' });
  }
};

// Get overall academic performance
exports.getOverallPerformance = async (req, res) => {
  try {
    const studentId = req.user._id;

    const overallStats = await Marks.aggregate([
      { $match: { student: studentId } },
      {
        $group: {
          _id: null,
          totalSubjects: { $sum: 1 },
          totalCredits: { $sum: '$credits' },
          overallGPA: { $avg: '$gpa' },
          overallMarks: { $avg: '$totalMarks' },
          passedSubjects: {
            $sum: { $cond: [{ $gte: ['$totalMarks', 40] }, 1, 0] }
          },
          failedSubjects: {
            $sum: { $cond: [{ $lt: ['$totalMarks', 40] }, 1, 0] }
          },
          gradeDistribution: {
            $push: '$grade'
          },
          semesterWiseGPA: {
            $push: {
              semester: '$semester',
              gpa: '$gpa',
              academicYear: '$academicYear'
            }
          }
        }
      }
    ]);

    // Calculate CGPA
    const semesterGPAs = await Marks.aggregate([
      { $match: { student: studentId } },
      {
        $group: {
          _id: { semester: '$semester', academicYear: '$academicYear' },
          semesterGPA: { $avg: '$gpa' },
          totalCredits: { $sum: '$credits' }
        }
      }
    ]);

    let totalWeightedGPA = 0;
    let totalCredits = 0;
    
    semesterGPAs.forEach(sem => {
      totalWeightedGPA += sem.semesterGPA * sem.totalCredits;
      totalCredits += sem.totalCredits;
    });

    const cgpa = totalCredits > 0 ? totalWeightedGPA / totalCredits : 0;

    res.json({
      success: true,
      overallStats: overallStats[0] || {},
      cgpa: Math.round(cgpa * 100) / 100,
      semesterGPAs
    });

  } catch (error) {
    console.error('Overall performance error:', error);
    res.status(500).json({ msg: 'Error fetching overall performance' });
  }
};

// Helper function to calculate marks analytics
async function calculateMarksAnalytics(studentId, marks, query) {
  if (marks.length === 0) {
    return {
      totalSubjects: 0,
      averageMarks: 0,
      averageGPA: 0,
      gradeDistribution: {},
      semesterProgress: [],
      performanceTrend: []
    };
  }

  // Calculate basic stats
  const totalSubjects = marks.length;
  const totalMarks = marks.reduce((sum, mark) => sum + (mark.totalMarks || 0), 0);
  const totalGPA = marks.reduce((sum, mark) => sum + (mark.gpa || 0), 0);
  
  const averageMarks = totalMarks / totalSubjects;
  const averageGPA = totalGPA / totalSubjects;

  // Grade distribution
  const gradeDistribution = marks.reduce((dist, mark) => {
    const grade = mark.grade || 'F';
    dist[grade] = (dist[grade] || 0) + 1;
    return dist;
  }, {});

  // Semester progress
  const semesterProgress = await Marks.aggregate([
    { $match: { student: studentId } },
    {
      $group: {
        _id: { semester: '$semester', academicYear: '$academicYear' },
        subjects: { $sum: 1 },
        avgMarks: { $avg: '$totalMarks' },
        avgGPA: { $avg: '$gpa' },
        passedSubjects: {
          $sum: { $cond: [{ $gte: ['$totalMarks', 40] }, 1, 0] }
        }
      }
    },
    { $sort: { '_id.academicYear': 1, '_id.semester': 1 } }
  ]);

  // Performance trend (monthly)
  const performanceTrend = await Marks.aggregate([
    { $match: { student: studentId } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        avgMarks: { $avg: '$totalMarks' },
        subjectsCount: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return {
    totalSubjects,
    averageMarks: Math.round(averageMarks * 100) / 100,
    averageGPA: Math.round(averageGPA * 100) / 100,
    gradeDistribution,
    semesterProgress,
    performanceTrend
  };
}
