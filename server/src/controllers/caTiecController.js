const { pool, sql } = require('../config/db');

// Get all shifts
exports.getAllCaTiec = async (req, res) => {
  try {
    // Connect to database
    await pool.connect();
    
    // Prepare and execute query
    const query = `SELECT * FROM CaTiec ORDER BY ID_Ca`;
    const result = await pool.request().query(query);
    
    res.status(200).json({
      success: true,
      data: result.recordset
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
    
    // Connect to database
    await pool.connect();
    
    // Prepare and execute query
    const query = `SELECT * FROM CaTiec WHERE ID_Ca = @id`;
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(query);
    
    // Check if shift exists
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Shift with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.recordset[0]
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