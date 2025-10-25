const Timetable = require('../models/Timetable');

// Get all timetable slots
exports.getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.find()
      .populate('faculty', 'name email')
      .populate('createdBy', 'name email')
      .sort({ day: 1, startTime: 1 });

    res.status(200).json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ msg: 'Server error fetching timetable' });
  }
};

// Create a new timetable slot
exports.createTimetableSlot = async (req, res) => {
  try {
    const { day, period, startTime, endTime, subject, room, batch, faculty, department } = req.body;

    // Check for conflicts
    const conflict = await Timetable.findOne({
      day,
      period,
      room
    });

    if (conflict) {
      return res.status(400).json({ msg: 'Time slot conflict: Room already occupied at this period' });
    }

    const timetableSlot = await Timetable.create({
      day,
      period,
      startTime,
      endTime,
      subject,
      room,
      batch,
      faculty: faculty || req.user._id,
      createdBy: req.user._id,
      department: department || req.user.department
    });

    await timetableSlot.populate('faculty', 'name email');
    await timetableSlot.populate('createdBy', 'name email');

    res.status(201).json({ msg: 'Timetable slot created successfully', timetableSlot });
  } catch (error) {
    console.error('Error creating timetable slot:', error);
    res.status(500).json({ msg: 'Server error creating timetable slot' });
  }
};

// Update a timetable slot
exports.updateTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { day, period, startTime, endTime, subject, room, batch, faculty, department } = req.body;

    // Check for conflicts (excluding current slot)
    const conflict = await Timetable.findOne({
      _id: { $ne: id },
      day,
      period,
      room
    });

    if (conflict) {
      return res.status(400).json({ msg: 'Time slot conflict: Room already occupied at this period' });
    }

    const timetableSlot = await Timetable.findByIdAndUpdate(
      id,
      { day, period, startTime, endTime, subject, room, batch, faculty: faculty || req.user._id, department: department || req.user.department },
      { new: true }
    ).populate('faculty', 'name email').populate('createdBy', 'name email');

    if (!timetableSlot) {
      return res.status(404).json({ msg: 'Timetable slot not found' });
    }

    res.status(200).json({ msg: 'Timetable slot updated successfully', timetableSlot });
  } catch (error) {
    console.error('Error updating timetable slot:', error);
    res.status(500).json({ msg: 'Server error updating timetable slot' });
  }
};

// Delete a timetable slot
exports.deleteTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const timetableSlot = await Timetable.findByIdAndDelete(id);

    if (!timetableSlot) {
      return res.status(404).json({ msg: 'Timetable slot not found' });
    }

    res.status(200).json({ msg: 'Timetable slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting timetable slot:', error);
    res.status(500).json({ msg: 'Server error deleting timetable slot' });
  }
};

// Get timetable for a specific faculty
exports.getFacultyTimetable = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const faculty = facultyId || req.user._id;

    const timetable = await Timetable.find({ faculty })
      .populate('faculty', 'name email')
      .sort({ day: 1, startTime: 1 });

    res.status(200).json(timetable);
  } catch (error) {
    console.error('Error fetching faculty timetable:', error);
    res.status(500).json({ msg: 'Server error fetching faculty timetable' });
  }
};
