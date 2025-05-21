const { pool, execute } = require('../config/db');

// Get all shifts
exports.getAllCaTiec = async (req, res) => {
  try {
    // Prepare and execute query
    const query = `SELECT * FROM CaTiec ORDER BY ID_Ca`;
    const result = await execute(query, []);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching shifts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shifts',
      error: error.message
    });
  }
};

// Get shift by ID
exports.getCaTiecById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prepare and execute query
    const query = `SELECT * FROM CaTiec WHERE ID_Ca = ?`;
    const result = await execute(query, [parseInt(id)]);
    
    // Check if shift exists
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Shift with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error fetching shift:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shift',
      error: error.message
    });
  }
}; 