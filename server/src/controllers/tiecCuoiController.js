const { pool, execute } = require('../config/db');

// Get all wedding parties
exports.getAllTiecCuoi = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'NgayToChuc';
    const sortOrder = req.query.sortOrder || 'desc';
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Prepare the SQL query with pagination, sorting and join to get CaTiec details
    const query = `
      SELECT TC.*, CT.TenCa
      FROM TiecCuoi TC
      LEFT JOIN CaTiec CT ON TC.ID_Ca = CT.ID_Ca
      ORDER BY ${sortBy === 'NgayToChuc' 
                ? 'TC.NgayToChuc' 
                : sortBy === 'ThoiDiemDat' 
                  ? 'TC.ThoiDiemDat' 
                  : 'TC.ID_TiecCuoi'} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    // Get count of total items for pagination metadata
    const countQuery = `SELECT COUNT(*) AS totalCount FROM TiecCuoi`;
    
    // Execute both queries
    const tiecCuoiList = await execute(query, []);
    const countResult = await execute(countQuery, []);
    
    // Extract data from results
    const totalItems = countResult[0].totalCount;
    const totalPages = Math.ceil(totalItems / limit);
    
    res.status(200).json({
      success: true,
      data: tiecCuoiList,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      sorting: {
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching wedding parties:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wedding parties',
      error: error.message
    });
  }
};

// Get wedding party by ID
exports.getTiecCuoiById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prepare and execute query with join to get CaTiec details
    const query = `
      SELECT TC.*, CT.TenCa
      FROM TiecCuoi TC
      LEFT JOIN CaTiec CT ON TC.ID_Ca = CT.ID_Ca
      WHERE TC.ID_TiecCuoi = ?
    `;
    
    const result = await execute(query, [parseInt(id)]);
    
    // Check if wedding party exists
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Wedding party with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error fetching wedding party:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wedding party',
      error: error.message
    });
  }
};

// Create a new wedding party
exports.createTiecCuoi = async (req, res) => {
  try {
    const newTiecCuoi = req.body;
    
    // Prepare and execute query
    const query = `
      INSERT INTO TiecCuoi (
        ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, 
        ThoiDiemDat, SoLuongBan, SoBanDuTru
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      newTiecCuoi.ID_KhachHang,
      newTiecCuoi.ID_SanhTiec,
      new Date(newTiecCuoi.NgayToChuc),
      newTiecCuoi.ID_Ca,
      new Date(newTiecCuoi.ThoiDiemDat),
      newTiecCuoi.SoLuongBan,
      newTiecCuoi.SoBanDuTru
    ];
    
    const result = await execute(query, params);
    
    // Get the newly created record
    const newRecordQuery = `SELECT * FROM TiecCuoi WHERE ID_TiecCuoi = ?`;
    const newRecord = await execute(newRecordQuery, [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Wedding party created successfully',
      data: newRecord[0]
    });
  } catch (error) {
    console.error('Error creating wedding party:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create wedding party',
      error: error.message
    });
  }
};

// Update a wedding party
exports.updateTiecCuoi = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    // Check if wedding party exists
    const checkQuery = `SELECT COUNT(*) AS count FROM TiecCuoi WHERE ID_TiecCuoi = ?`;
    const checkResult = await execute(checkQuery, [parseInt(id)]);
    
    if (checkResult[0].count === 0) {
      return res.status(404).json({
        success: false,
        message: `Wedding party with ID ${id} not found`
      });
    }
    
    // Prepare and execute update query
    const query = `
      UPDATE TiecCuoi
      SET
        ID_KhachHang = ?,
        ID_SanhTiec = ?,
        NgayToChuc = ?,
        ID_Ca = ?,
        ThoiDiemDat = ?,
        SoLuongBan = ?,
        SoBanDuTru = ?
      WHERE ID_TiecCuoi = ?
    `;
    
    const params = [
      updatedData.ID_KhachHang,
      updatedData.ID_SanhTiec,
      new Date(updatedData.NgayToChuc),
      updatedData.ID_Ca,
      new Date(updatedData.ThoiDiemDat),
      updatedData.SoLuongBan,
      updatedData.SoBanDuTru,
      parseInt(id)
    ];
    
    await execute(query, params);
    
    // Get the updated record
    const updatedRecordQuery = `SELECT * FROM TiecCuoi WHERE ID_TiecCuoi = ?`;
    const updatedRecord = await execute(updatedRecordQuery, [parseInt(id)]);
    
    res.status(200).json({
      success: true,
      message: 'Wedding party updated successfully',
      data: updatedRecord[0]
    });
  } catch (error) {
    console.error('Error updating wedding party:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update wedding party',
      error: error.message
    });
  }
};

// Delete a wedding party
exports.deleteTiecCuoi = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if wedding party exists
    const checkQuery = `SELECT COUNT(*) AS count FROM TiecCuoi WHERE ID_TiecCuoi = ?`;
    const checkResult = await execute(checkQuery, [parseInt(id)]);
    
    if (checkResult[0].count === 0) {
      return res.status(404).json({
        success: false,
        message: `Wedding party with ID ${id} not found`
      });
    }
    
    // Prepare and execute delete query
    const query = `DELETE FROM TiecCuoi WHERE ID_TiecCuoi = ?`;
    await execute(query, [parseInt(id)]);
    
    res.status(200).json({
      success: true,
      message: 'Wedding party deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting wedding party:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete wedding party',
      error: error.message
    });
  }
}; 