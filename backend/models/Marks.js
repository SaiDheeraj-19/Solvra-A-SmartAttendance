const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  year: { type: Number, required: true },
  subject: { type: String, required: true },
  subjectCode: { type: String, required: true },
  credits: { type: Number, required: true, min: 1, max: 4 },
  
  // Exam marks
  midTerm1: {
    marks: { type: Number, min: 0, max: 100 },
    maxMarks: { type: Number, default: 100 },
    examDate: Date,
    status: { type: String, enum: ['pending', 'completed', 'absent'], default: 'pending' }
  },
  
  midTerm2: {
    marks: { type: Number, min: 0, max: 100 },
    maxMarks: { type: Number, default: 100 },
    examDate: Date,
    status: { type: String, enum: ['pending', 'completed', 'absent'], default: 'pending' }
  },
  
  finalExam: {
    marks: { type: Number, min: 0, max: 100 },
    maxMarks: { type: Number, default: 100 },
    examDate: Date,
    status: { type: String, enum: ['pending', 'completed', 'absent'], default: 'pending' }
  },
  
  // Calculated fields
  totalMarks: { type: Number, min: 0, max: 100 },
  grade: { type: String, enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'] },
  gpa: { type: Number, min: 0, max: 10 },
  
  // Additional info
  attendancePercentage: { type: Number, min: 0, max: 100 },
  remarks: String,
  
  // Academic year info
  academicYear: { type: String, required: true }, // e.g., "2023-24"
  department: { type: String, required: true },
  
  // Status
  status: { type: String, enum: ['active', 'completed', 'backlog'], default: 'active' }
}, { timestamps: true });

// Indexes for efficient queries
marksSchema.index({ student: 1, semester: 1, academicYear: 1 });
marksSchema.index({ student: 1, subjectCode: 1 });
marksSchema.index({ semester: 1, department: 1 });

// Calculate total marks and grade before saving
marksSchema.pre('save', function(next) {
  if (this.midTerm1.marks !== undefined && this.midTerm2.marks !== undefined && this.finalExam.marks !== undefined) {
    // Weighted calculation: Mid1(25%) + Mid2(25%) + Final(50%)
    this.totalMarks = Math.round(
      (this.midTerm1.marks * 0.25) + 
      (this.midTerm2.marks * 0.25) + 
      (this.finalExam.marks * 0.50)
    );
    
    // Calculate grade based on total marks
    if (this.totalMarks >= 90) {
      this.grade = 'A+';
      this.gpa = 10;
    } else if (this.totalMarks >= 80) {
      this.grade = 'A';
      this.gpa = 9;
    } else if (this.totalMarks >= 70) {
      this.grade = 'B+';
      this.gpa = 8;
    } else if (this.totalMarks >= 60) {
      this.grade = 'B';
      this.gpa = 7;
    } else if (this.totalMarks >= 50) {
      this.grade = 'C+';
      this.gpa = 6;
    } else if (this.totalMarks >= 40) {
      this.grade = 'C';
      this.gpa = 5;
    } else if (this.totalMarks >= 30) {
      this.grade = 'D';
      this.gpa = 4;
    } else {
      this.grade = 'F';
      this.gpa = 0;
    }
  }
  next();
});

module.exports = mongoose.model('Marks', marksSchema);
