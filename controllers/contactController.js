import ContactMessage from '../models/ContactMessage.js';

// Create a new contact message
export const createContactMessage = async (req, res) => {
  try {
    const newMessage = new ContactMessage(req.body);
    await newMessage.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Your message has been sent successfully!'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all contact messages (admin only)
export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await ContactMessage.findByIdAndUpdate(
      id, 
      { read: true },
      { new: true, runValidators: true }
    );
    
    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: message
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete a message
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await ContactMessage.findByIdAndDelete(id);
    
    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
