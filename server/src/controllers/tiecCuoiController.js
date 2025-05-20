const { pool, sql } = require('../config/db');

// Get all wedding parties
exports.getAllTiecCuoi = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'NgayToChuc';
    const sortOrder = req.query.sortOrder || 'desc';
    
    // Connect to database
    await pool.connect();
    
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
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;
    
    // Get count of total items for pagination metadata
    const countQuery = `SELECT COUNT(*) AS totalCount FROM TiecCuoi`;
    
    // Execute both queries
    const result = await pool.request().query(query);
    const countResult = await pool.request().query(countQuery);
    
    // Extract data from results
    const tiecCuoiList = result.recordset;
    const totalItems = countResult.recordset[0].totalCount;
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
    
    // Connect to database
    await pool.connect();
    
    // Prepare and execute query with join to get CaTiec details
    const query = `
      SELECT TC.*, CT.TenCa
      FROM TiecCuoi TC
      LEFT JOIN CaTiec CT ON TC.ID_Ca = CT.ID_Ca
      WHERE TC.ID_TiecCuoi = @id
    `;
    
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(query);
    
    // Check if wedding party exists
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Wedding party with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.recordset[0]
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
    
    // Connect to database
    await pool.connect();
    
    // Prepare and execute query
    const query = `
      INSERT INTO TiecCuoi (
        ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, 
        ThoiDiemDat, SoLuongBan, SoBanDuTru
      )
      OUTPUT INSERTED.*
      VALUES (
        @ID_KhachHang, @ID_SanhTiec, @NgayToChuc, @ID_Ca, 
        @ThoiDiemDat, @SoLuongBan, @SoBanDuTru
      )
    `;
    
    const result = await pool.request()
      .input('ID_KhachHang', sql.Int, newTiecCuoi.ID_KhachHang)
      .input('ID_SanhTiec', sql.Int, newTiecCuoi.ID_SanhTiec)
      .input('NgayToChuc', sql.Date, new Date(newTiecCuoi.NgayToChuc))
      .input('ID_Ca', sql.Int, newTiecCuoi.ID_Ca)
      .input('ThoiDiemDat', sql.DateTime, new Date(newTiecCuoi.ThoiDiemDat))
      .input('SoLuongBan', sql.Int, newTiecCuoi.SoLuongBan)
      .input('SoBanDuTru', sql.Int, newTiecCuoi.SoBanDuTru)
      .query(query);
    
    res.status(201).json({
      success: true,
      message: 'Wedding party created successfully',
      data: result.recordset[0]
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
    
    // Connect to database
    await pool.connect();
    
    // Check if wedding party exists
    const checkQuery = `SELECT COUNT(*) AS count FROM TiecCuoi WHERE ID_TiecCuoi = @id`;
    const checkResult = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(checkQuery);
    
    if (checkResult.recordset[0].count === 0) {
      return res.status(404).json({
        success: false,
        message: `Wedding party with ID ${id} not found`
      });
    }
    
    // Prepare and execute update query
    const query = `
      UPDATE TiecCuoi
      SET
        ID_KhachHang = @ID_KhachHang,
        ID_SanhTiec = @ID_SanhTiec,
        NgayToChuc = @NgayToChuc,
        ID_Ca = @ID_Ca,
        ThoiDiemDat = @ThoiDiemDat,
        SoLuongBan = @SoLuongBan,
        SoBanDuTru = @SoBanDuTru
      OUTPUT INSERTED.*
      WHERE ID_TiecCuoi = @id
    `;
    
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('ID_KhachHang', sql.Int, updatedData.ID_KhachHang)
      .input('ID_SanhTiec', sql.Int, updatedData.ID_SanhTiec)
      .input('NgayToChuc', sql.Date, new Date(updatedData.NgayToChuc))
      .input('ID_Ca', sql.Int, updatedData.ID_Ca)
      .input('ThoiDiemDat', sql.DateTime, new Date(updatedData.ThoiDiemDat))
      .input('SoLuongBan', sql.Int, updatedData.SoLuongBan)
      .input('SoBanDuTru', sql.Int, updatedData.SoBanDuTru)
      .query(query);
    
    res.status(200).json({
      success: true,
      message: 'Wedding party updated successfully',
      data: result.recordset[0]
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
    
    // Connect to database
    await pool.connect();
    
    // Check if wedding party exists
    const checkQuery = `SELECT COUNT(*) AS count FROM TiecCuoi WHERE ID_TiecCuoi = @id`;
    const checkResult = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(checkQuery);
    
    if (checkResult.recordset[0].count === 0) {
      return res.status(404).json({
        success: false,
        message: `Wedding party with ID ${id} not found`
      });
    }
    
    // Prepare and execute delete query
    const query = `DELETE FROM TiecCuoi WHERE ID_TiecCuoi = @id`;
    await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(query);
    
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