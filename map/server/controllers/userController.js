const User = require('../models/User');

exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, city, state, country } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        location: {
          latitude,
          longitude,
          city: city || null,
          state: state || null,
          country: country || null,
          lastUpdated: new Date()
        }
      },
      { new: true }
    );

    // Emit socket event for real-time update
    if (req.app.get('io')) {
      req.app.get('io').emit('locationUpdate', {
        userId: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        latitude,
        longitude,
        city,
        state,
        country
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update location'
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-googleId -__v');
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-googleId -__v');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};