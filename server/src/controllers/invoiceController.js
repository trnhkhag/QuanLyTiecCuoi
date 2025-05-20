const { pool, sql } = require('../config/db');

// Get all invoices with additional details
exports.getAllInvoices = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'NgayLap';
    const sortOrder = req.query.sortOrder || 'desc';
    
    // Connect to database
    await pool.connect();
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Filter by invoice type, can accept multiple types as comma-separated string
    const invoiceTypes = req.query.loaiHoaDon ? req.query.loaiHoaDon.split(',') : [];
    
    // Build type filter condition if provided
    let typeFilterCondition = '';
    let typeFilterParams = {};
    
    if (invoiceTypes.length > 0) {
      typeFilterCondition = 'AND HD.LoaiHoaDon IN (';
      invoiceTypes.forEach((type, index) => {
        const paramName = `type${index}`;
        typeFilterCondition += index === 0 ? `@${paramName}` : `, @${paramName}`;
        typeFilterParams[paramName] = type;
      });
      typeFilterCondition += ')';
    }
    
    // Prepare the SQL query with joins, pagination, and sorting
    const query = `
      SELECT HD.*,
             TC.NgayToChuc,
             CT.TenCa,
             CASE 
               WHEN DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) > 0 
               THEN DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) 
               ELSE 0 
             END as SoNgayTreHan,
             CASE 
               WHEN DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) > 0 
               THEN HD.TongTien * 0.01 * DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) 
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
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;
    
    // Get count of total items for pagination metadata
    const countQuery = `
      SELECT COUNT(*) AS totalCount 
      FROM HoaDon HD
      WHERE 1=1 ${typeFilterCondition}
    `;
    
    // Create request with type filter parameters if any
    let request = pool.request();
    
    // Add type parameters if filtering by invoice types
    for (const [paramName, paramValue] of Object.entries(typeFilterParams)) {
      request = request.input(paramName, sql.NVarChar, paramValue);
    }
    
    // Execute both queries
    const result = await request.query(query);
    const countResult = await request.query(countQuery);
    
    // Extract data from results
    const invoices = result.recordset;
    const totalItems = countResult.recordset[0].totalCount;
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
    
    // Connect to database
    await pool.connect();
    
    // Prepare and execute query with joins to get invoice with related details
    const query = `
      SELECT HD.*,
             TC.NgayToChuc,
             CT.TenCa,
             CASE 
               WHEN DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) > 0 
               THEN DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) 
               ELSE 0 
             END as SoNgayTreHan,
             CASE 
               WHEN DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) > 0 
               THEN HD.TongTien * 0.01 * DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) 
               ELSE 0 
             END as TienPhat
      FROM HoaDon HD
      LEFT JOIN TiecCuoi TC ON HD.ID_TiecCuoi = TC.ID_TiecCuoi
      LEFT JOIN CaTiec CT ON TC.ID_Ca = CT.ID_Ca
      WHERE HD.ID_HoaDon = @id
    `;
    
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(query);
    
    // Check if invoice exists
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Invoice with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.recordset[0]
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
    
    // Connect to database
    await pool.connect();
    
    // Prepare and execute query
    const query = `
      INSERT INTO HoaDon (
        ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu
      )
      OUTPUT INSERTED.*
      VALUES (
        @ID_TiecCuoi, @NgayLap, @TongTien, @TienThanhToan, @LoaiHoaDon, @GhiChu
      )
    `;
    
    const result = await pool.request()
      .input('ID_TiecCuoi', sql.Int, newInvoice.ID_TiecCuoi)
      .input('NgayLap', sql.Date, new Date(newInvoice.NgayLap || new Date()))
      .input('TongTien', sql.Decimal(18, 2), newInvoice.TongTien)
      .input('TienThanhToan', sql.Decimal(18, 2), newInvoice.TienThanhToan)
      .input('LoaiHoaDon', sql.NVarChar(50), newInvoice.LoaiHoaDon)
      .input('GhiChu', sql.NVarChar(255), newInvoice.GhiChu || null)
      .query(query);
    
    // Get the inserted invoice with additional details
    const insertedInvoice = result.recordset[0];
    const enrichedQuery = `
      SELECT HD.*,
             TC.NgayToChuc,
             CT.TenCa,
             CASE 
               WHEN DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) > 0 
               THEN DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) 
               ELSE 0 
             END as SoNgayTreHan,
             CASE 
               WHEN DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) > 0 
               THEN HD.TongTien * 0.01 * DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) 
               ELSE 0 
             END as TienPhat
      FROM HoaDon HD
      LEFT JOIN TiecCuoi TC ON HD.ID_TiecCuoi = TC.ID_TiecCuoi
      LEFT JOIN CaTiec CT ON TC.ID_Ca = CT.ID_Ca
      WHERE HD.ID_HoaDon = @id
    `;
    
    const enrichedResult = await pool.request()
      .input('id', sql.Int, insertedInvoice.ID_HoaDon)
      .query(enrichedQuery);
    
    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: enrichedResult.recordset[0]
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
    
    // Connect to database
    await pool.connect();
    
    // Check if invoice exists
    const checkQuery = `SELECT COUNT(*) AS count FROM HoaDon WHERE ID_HoaDon = @id`;
    const checkResult = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(checkQuery);
    
    if (checkResult.recordset[0].count === 0) {
      return res.status(404).json({
        success: false,
        message: `Invoice with ID ${id} not found`
      });
    }
    
    // Prepare and execute update query
    const query = `
      UPDATE HoaDon
      SET
        NgayLap = @NgayLap,
        TongTien = @TongTien,
        LoaiHoaDon = @LoaiHoaDon,
        ID_TiecCuoi = @ID_TiecCuoi,
        ID_NguoiDung = @ID_NguoiDung
      OUTPUT INSERTED.*
      WHERE ID_HoaDon = @id
    `;
    
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('NgayLap', sql.DateTime, new Date(updatedData.NgayLap))
      .input('TongTien', sql.Decimal(18, 2), updatedData.TongTien)
      .input('LoaiHoaDon', sql.NVarChar, updatedData.LoaiHoaDon)
      .input('ID_TiecCuoi', sql.Int, updatedData.ID_TiecCuoi)
      .input('ID_NguoiDung', sql.Int, updatedData.ID_NguoiDung)
      .query(query);
    
    // Get the updated invoice with additional details
    const updatedInvoice = result.recordset[0];
    const enrichedQuery = `
      SELECT HD.*,
             TC.NgayToChuc,
             CT.TenCa,
             CASE 
               WHEN DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) > 0 
               THEN DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) 
               ELSE 0 
             END as SoNgayTreHan,
             CASE 
               WHEN DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) > 0 
               THEN HD.TongTien * 0.01 * DATEDIFF(day, TC.ThoiDiemDat, GETDATE()) 
               ELSE 0 
             END as TienPhat
      FROM HoaDon HD
      LEFT JOIN TiecCuoi TC ON HD.ID_TiecCuoi = TC.ID_TiecCuoi
      LEFT JOIN CaTiec CT ON TC.ID_Ca = CT.ID_Ca
      WHERE HD.ID_HoaDon = @id
    `;
    
    const enrichedResult = await pool.request()
      .input('id', sql.Int, updatedInvoice.ID_HoaDon)
      .query(enrichedQuery);
    
    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      data: enrichedResult.recordset[0]
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
    
    // Connect to database
    await pool.connect();
    
    // Check if invoice exists
    const checkQuery = `SELECT COUNT(*) AS count FROM HoaDon WHERE ID_HoaDon = @id`;
    const checkResult = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(checkQuery);
    
    if (checkResult.recordset[0].count === 0) {
      return res.status(404).json({
        success: false,
        message: `Invoice with ID ${id} not found`
      });
    }
    
    // Prepare and execute delete query
    const query = `DELETE FROM HoaDon WHERE ID_HoaDon = @id`;
    await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(query);
    
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