const mongoose = require('mongoose');
const Marks = require('./models/Marks');
const User = require('./models/User');

// Sample subjects for each semester
const semesterSubjects = {
  1: [
    { name: 'Mathematics-I', code: 'MATH101', credits: 4 },
    { name: 'Physics', code: 'PHY101', credits: 4 },
    { name: 'Chemistry', code: 'CHEM101', credits: 3 },
    { name: 'Programming in C', code: 'CSE101', credits: 3 },
    { name: 'English', code: 'ENG101', credits: 2 }
  ],
  2: [
    { name: 'Mathematics-II', code: 'MATH102', credits: 4 },
    { name: 'Basic Electronics', code: 'ECE101', credits: 3 },
    { name: 'Data Structures', code: 'CSE102', credits: 4 },
    { name: 'Digital Logic Design', code: 'CSE103', credits: 3 },
    { name: 'Environmental Science', code: 'ENV101', credits: 2 }
  ],
  3: [
    { name: 'Discrete Mathematics', code: 'MATH201', credits: 4 },
    { name: 'Computer Organization', code: 'CSE201', credits: 4 },
    { name: 'Database Management', code: 'CSE202', credits: 4 },
    { name: 'Operating Systems', code: 'CSE203', credits: 4 },
    { name: 'Software Engineering', code: 'CSE204', credits: 3 }
  ],
  4: [
    { name: 'Algorithm Design', code: 'CSE301', credits: 4 },
    { name: 'Computer Networks', code: 'CSE302', credits: 4 },
    { name: 'Web Technologies', code: 'CSE303', credits: 3 },
    { name: 'Machine Learning', code: 'CSE304', credits: 3 },
    { name: 'Project Management', code: 'CSE305', credits: 2 }
  ],
  5: [
    { name: 'Artificial Intelligence', code: 'CSE401', credits: 4 },
    { name: 'Data Mining', code: 'CSE402', credits: 3 },
    { name: 'Mobile Computing', code: 'CSE403', credits: 3 },
    { name: 'Cybersecurity', code: 'CSE404', credits: 3 },
    { name: 'Cloud Computing', code: 'CSE405', credits: 3 }
  ],
  6: [
    { name: 'Deep Learning', code: 'CSE501', credits: 4 },
    { name: 'Blockchain Technology', code: 'CSE502', credits: 3 },
    { name: 'IoT Systems', code: 'CSE503', credits: 3 },
    { name: 'Big Data Analytics', code: 'CSE504', credits: 3 },
    { name: 'Project-I', code: 'CSE505', credits: 4 }
  ],
  7: [
    { name: 'Advanced AI', code: 'CSE601', credits: 4 },
    { name: 'Computer Vision', code: 'CSE602', credits: 3 },
    { name: 'Natural Language Processing', code: 'CSE603', credits: 3 },
    { name: 'Robotics', code: 'CSE604', credits: 3 },
    { name: 'Internship', code: 'CSE605', credits: 3 }
  ],
  8: [
    { name: 'Project-II', code: 'CSE701', credits: 6 },
    { name: 'Seminar', code: 'CSE702', credits: 2 },
    { name: 'Professional Ethics', code: 'CSE703', credits: 2 },
    { name: 'Entrepreneurship', code: 'CSE704', credits: 2 },
    { name: 'Industry Training', code: 'CSE705', credits: 4 }
  ]
};

// Generate random marks
function generateRandomMarks() {
  const mid1 = Math.floor(Math.random() * 40) + 60; // 60-100
  const mid2 = Math.floor(Math.random() * 40) + 60; // 60-100
  const final = Math.floor(Math.random() * 40) + 60; // 60-100
  
  return { mid1, mid2, final };
}

// Seed marks data for a student
async function seedMarksData(studentId) {
  try {
    console.log(`Seeding marks data for student: ${studentId}`);
    
    const academicYears = ['2020-21', '2021-22', '2022-23', '2023-24'];
    
    for (let semester = 1; semester <= 8; semester++) {
      const academicYear = academicYears[Math.floor((semester - 1) / 2)];
      const subjects = semesterSubjects[semester];
      
      for (const subject of subjects) {
        const marks = generateRandomMarks();
        
        const marksRecord = new Marks({
          student: studentId,
          semester: semester,
          year: Math.floor((semester - 1) / 2) + 1,
          subject: subject.name,
          subjectCode: subject.code,
          credits: subject.credits,
          midTerm1: {
            marks: marks.mid1,
            maxMarks: 100,
            examDate: new Date(2023, semester * 2, 15),
            status: 'completed'
          },
          midTerm2: {
            marks: marks.mid2,
            maxMarks: 100,
            examDate: new Date(2023, semester * 2 + 1, 15),
            status: 'completed'
          },
          finalExam: {
            marks: marks.final,
            maxMarks: 100,
            examDate: new Date(2023, semester * 2 + 2, 15),
            status: 'completed'
          },
          academicYear: academicYear,
          department: 'CSE',
          status: 'completed'
        });
        
        await marksRecord.save();
        console.log(`Created marks for ${subject.name} - Semester ${semester}`);
      }
    }
    
    console.log('Marks data seeded successfully!');
  } catch (error) {
    console.error('Error seeding marks data:', error);
  }
}

// Main seeding function
async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find a student to seed data for
    const student = await User.findOne({ role: 'student' });
    if (!student) {
      console.log('No student found. Please create a student account first.');
      return;
    }
    
    // Clear existing marks for this student
    await Marks.deleteMany({ student: student._id });
    console.log('Cleared existing marks data');
    
    // Seed new marks data
    await seedMarksData(student._id);
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  seedData();
}

module.exports = { seedMarksData };
