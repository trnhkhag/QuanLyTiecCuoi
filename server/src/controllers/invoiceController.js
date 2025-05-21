const { pool, execute } = require('../config/db');

// Get all invoices with additional details
exports.getAllInvoices = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'NgayLap';
    const sortOrder = req.query.sortOrder || 'desc';
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Filter by invoice type, can accept multiple types as comma-separated string
    const invoiceTypes = req.query.loaiHoaDon ? req.query.loaiHoaDon.split(',') : [];
    
    // Build type filter condition if provided
    let typeFilterCondition = '';
    let typeFilterParams = [];
    
    if (invoiceTypes.length > 0) {
      typeFilterCondition = 'AND HD.LoaiHoaDon IN (';
      invoiceTypes.forEach((type, index) => {
        typeFilterCondition += index === 0 ? '?' : ', ?';
        typeFilterParams.push(type);
      });
      typeFilterCondition += ')';
    }
    
    // Prepare the SQL query with joins, pagination, and sorting
    const query = `
      SELECT HD.*,
             TC.NgayToChuc,
             CT.TenCa,
             CASE 
               WHEN DATEDIFF(CURDATE(), TC.ThoiDiemDat) > 0 
               THEN DATEDIFF(CURDATE(), TC.ThoiDiemDat) 
               ELSE 0 
             END as SoNgayTreHan,
             CASE 
               WHEN DATEDIFF(CURDATE(), TC.ThoiDiemDat) > 0 
               THEN HD.TongTien * 0.01 * DATEDIFF(CURDATE(), TC.ThoiDiemDat) 
               ELSE 0 
             END as TienPhat
      FROM HoaDon HD
      LEFT JOIN TiecCuoi TC ON HD.ID_TiecCuoi = TC.ID_TiecCuoi
      LEFT JOIN CaTiec CT ON TC.ID_Ca = CT.ID_Ca
      WHERE 1=1 ${typeFilterCondition}
      ORDER BY ${sortBy === 'NgayLap' 
                ? 'HD.NgayLap' 
                : sortBy === 'NgayToChuc' 
                  ? 'TC.NgayToChuc' 
                  : 'HD.ID_HoaDon'} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    // Get count of total items for pagination metadata
    const countQuery = `
      SELECT COUNT(*) AS totalCount 
      FROM HoaDon HD
      WHERE 1=1 ${typeFilterCondition}
    `;
    
    // Execute both queries with parameters
    const params = [...typeFilterParams];
    const countParams = [...typeFilterParams];
    
    const invoices = await execute(query, params);
    const countResult = await execute(countQuery, countParams);
    
    // Extract data from results
    const totalItems = countResult[0].totalCount;
    const totalPages = Math.ceil(totalItems / limit);
    
    res.status(200).json({
      success: true,
      data: invoices,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        invoiceTypes
      },
      sorting: {
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error.message
    });
  }
};

// Get invoice by ID with additional details
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prepare and execute query with joins to get invoice with related details
    const query = `
      SELECT HD.*,
             TC.NgayToChuc,
             CT.TenCa,
             CASE 
               WHEN DATEDIFF(CURDATE(), TC.ThoiDiemDat) > 0 
               THEN DATEDIFF(CURDATE(), TC.ThoiDiemDat) 
               ELSE 0 
             END as SoNgayTreHan,
             CASE 
               WHEN DATEDIFF(CURDATE(), TC.ThoiDiemDat) > 0 
               THEN HD.TongTien * 0.01 * DATEDIFF(CURDATE(), TC.ThoiDiemDat) 
               ELSE 0 
             END as TienPhat
      FROM HoaDon HD
      LEFT JOIN TiecCuoi TC ON HD.ID_TiecCuoi = TC.ID_TiecCuoi
      LEFT JOIN CaTiec CT ON TC.ID_Ca = CT.ID_Ca
      WHERE HD.ID_HoaDon = ?
    `;
    
    const result = await execute(query, [parseInt(id)]);
    
    // Check if invoice exists
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Invoice with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
      error: error.message
    });
  }
};

// Create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const newInvoice = req.body;
    
    // Prepare and execute query
    const query = `
      INSERT INTO HoaDon (
        ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu
      )
      VALUES (
        ?, ?, ?, ?, ?, ?
      )
    `;
    
    const params = [
      newInvoice.ID_TiecCuoi,
      new Date(newInvoice.NgayLap || new Date()),
      newInvoice.TongTien,
      newInvoice.TienThanhToan,
      newInvoice.LoaiHoaDon,
      newInvoice.GhiChu || null
    ];
    
    const result = await execute(query, params);
    
    // Get the inserted invoice with additional details
    const enrichedQuery = `
      SELECT HD.*,
             TC.NgayToChuc,
             CT.TenCa,
             CASE 
               WHEN DATEDIFF(CURDATE(), TC.ThoiDiemDat) > 0 
               THEN DATEDIFF(CURDATE(), TC.ThoiDiemDat) 
               ELSE 0 
             END as SoNgayTreHan,
             CASE 
               WHEN DATEDIFF(CURDATE(), TC.ThoiDiemDat) > 0 
               THEN HD.TongTien * 0.01 * DATEDIFF(CURDATE(), TC.ThoiDiemDat) 
               ELSE 0 
             END as TienPhat
      FROM HoaDon HD
      LEFT JOIN TiecCuoi TC ON HD.ID_TiecCuoi = TC.ID_TiecCuoi
      LEFT JOIN CaTiec CT ON TC.ID_Ca = CT.ID_Ca
      WHERE HD.ID_HoaDon = ?
    `;
    
    const enrichedResult = await execute(enrichedQuery, [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: enrichedResult[0]
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message
    });
  }
};

// Update an invoice
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    // Check if invoice exists
    const checkQuery = `SELECT COUNT(*) AS count FROM HoaDon WHERE ID_HoaDon = ?`;
    const checkResult = await execute(checkQuery, [parseInt(id)]);
    
    if (checkResult[0].count === 0) {
      return res.status(404).json({
        success: false,
        message: `Invoice with ID ${id} not found`
      });
    }
    
    // Prepare and execute update query
    const query = `
      UPDATE HoaDon
      SET
        NgayLap = ?,
        TongTien = ?,
        TienThanhToan = ?,
        LoaiHoaDon = ?,
        GhiChu = ?,
        ID_TiecCuoi = ?
      WHERE ID_HoaDon = ?
    `;
    
    const params = [
      new Date(updatedData.NgayLap),
      updatedData.TongTien,
      updatedData.TienThanhToan,
      updatedData.LoaiHoaDon,
      updatedData.GhiChu,
      updatedData.ID_TiecCuoi,
      parseInt(id)
    ];
    
    await execute(query, params);
    
    // Get the updated invoice with additional details
    const enrichedQuery = `
      SELECT HD.*,
             TC.NgayToChuc,
             CT.TenCa,
             CASE 
               WHEN DATEDIFF(CURDATE(), TC.ThoiDiemDat) > 0 
               THEN DATEDIFF(CURDATE(), TC.ThoiDiemDat) 
               ELSE 0 
             END as SoNgayTreHan,
             CASE 
               WHEN DATEDIFF(CURDATE(), TC.ThoiDiemDat) > 0 
               THEN HD.TongTien * 0.01 * DATEDIFF(CURDATE(), TC.ThoiDiemDat) 
               ELSE 0 
             END as TienPhat
      FROM HoaDon HD
      LEFT JOIN TiecCuoi TC ON HD.ID_TiecCuoi = TC.ID_TiecCuoi
      LEFT JOIN CaTiec CT ON TC.ID_Ca = CT.ID_Ca
      WHERE HD.ID_HoaDon = ?
    `;
    
    const enrichedResult = await execute(enrichedQuery, [parseInt(id)]);
    
    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      data: enrichedResult[0]
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice',
      error: error.message
    });
  }
};

// Delete an invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if invoice exists
    const checkQuery = `SELECT COUNT(*) AS count FROM HoaDon WHERE ID_HoaDon = ?`;
    const checkResult = await execute(checkQuery, [parseInt(id)]);
    
    if (checkResult[0].count === 0) {
      return res.status(404).json({
        success: false,
        message: `Invoice with ID ${id} not found`
      });
    }
    
    // Prepare and execute delete query
    const query = `DELETE FROM HoaDon WHERE ID_HoaDon = ?`;
    await execute(query, [parseInt(id)]);
    
    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete invoice',
      error: error.message
    });
  }
};