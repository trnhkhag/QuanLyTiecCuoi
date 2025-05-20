const { pool, sql } = require('../config/db');
const { format, parseISO, startOfMonth, endOfMonth, subMonths } = require('date-fns');

// Get monthly report data
exports.getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentYear = parseInt(year) || new Date().getFullYear();
    const currentMonth = parseInt(month) || new Date().getMonth() + 1;
    
    // Connect to database
    await pool.connect();
    
    // Create date range for the specified month
    const startDate = startOfMonth(new Date(currentYear, currentMonth - 1));
    const endDate = endOfMonth(new Date(currentYear, currentMonth - 1));
    
    // Query to get monthly revenue statistics
    const query = `
      SELECT 
        COUNT(DISTINCT TC.ID_TiecCuoi) AS totalWeddings,
        SUM(HD.TienThanhToan) AS totalRevenue,
        CASE 
          WHEN COUNT(DISTINCT TC.ID_TiecCuoi) > 0 
          THEN SUM(HD.TienThanhToan) / COUNT(DISTINCT TC.ID_TiecCuoi) 
          ELSE 0 
        END AS averageRevenue
      FROM TiecCuoi TC
      JOIN HoaDon HD ON TC.ID_TiecCuoi = HD.ID_TiecCuoi
      WHERE TC.NgayToChuc BETWEEN @startDate AND @endDate
    `;
    
    const result = await pool.request()
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(query);
    
    // Get revenue breakdown by venue type
    const venueQuery = `
      SELECT 
        LS.TenLoai AS venueType,
        COUNT(TC.ID_TiecCuoi) AS weddingCount,
        SUM(HD.TienThanhToan) AS revenue
      FROM TiecCuoi TC
      JOIN HoaDon HD ON TC.ID_TiecCuoi = HD.ID_TiecCuoi
      JOIN SanhTiec ST ON TC.ID_SanhTiec = ST.ID_SanhTiec
      JOIN LoaiSanh LS ON ST.ID_LoaiSanh = LS.ID_LoaiSanh
      WHERE TC.NgayToChuc BETWEEN @startDate AND @endDate
      GROUP BY LS.TenLoai
      ORDER BY revenue DESC
    `;
    
    const venueResult = await pool.request()
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(venueQuery);
    
    // Get service usage statistics
    const serviceQuery = `
      SELECT 
        DV.TenDichVu AS serviceName,
        COUNT(TD.ID_TiecCuoi) AS usageCount,
        SUM(TD.SoLuong * TD.DonGia) AS revenue
      FROM TiecCuoi TC
      JOIN Tiec_DichVu TD ON TC.ID_TiecCuoi = TD.ID_TiecCuoi
      JOIN DichVu DV ON TD.ID_DichVu = DV.ID_DichVu
      WHERE TC.NgayToChuc BETWEEN @startDate AND @endDate
      GROUP BY DV.TenDichVu
      ORDER BY revenue DESC
    `;
    
    const serviceResult = await pool.request()
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(serviceQuery);
    
    // Extract data from results
    const stats = result.recordset[0] || {
      totalWeddings: 0,
      totalRevenue: 0,
      averageRevenue: 0
    };
    
    const venueBreakdown = venueResult.recordset;
    const serviceBreakdown = serviceResult.recordset;
    
    res.status(200).json({
      year: currentYear,
      month: currentMonth,
      totalRevenue: stats.totalRevenue || 0,
      totalWeddings: stats.totalWeddings || 0,
      averageRevenue: stats.averageRevenue || 0,
      venueBreakdown,
      serviceBreakdown
    });
  } catch (error) {
    console.error('Error generating monthly report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate monthly report',
      error: error.message
    });
  }
};

// Get yearly report data
exports.getYearlyReport = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = parseInt(year) || new Date().getFullYear();
    
    // Connect to database
    await pool.connect();
    
    // Query to get yearly statistics
    const query = `
      SELECT 
        COUNT(DISTINCT TC.ID_TiecCuoi) AS totalWeddings,
        SUM(HD.TienThanhToan) AS totalRevenue,
        CASE 
          WHEN COUNT(DISTINCT TC.ID_TiecCuoi) > 0 
          THEN SUM(HD.TienThanhToan) / COUNT(DISTINCT TC.ID_TiecCuoi) 
          ELSE 0 
        END AS averageRevenue
      FROM TiecCuoi TC
      JOIN HoaDon HD ON TC.ID_TiecCuoi = HD.ID_TiecCuoi
      WHERE YEAR(TC.NgayToChuc) = @year
    `;
    
    const result = await pool.request()
      .input('year', sql.Int, currentYear)
      .query(query);
    
    // Query to get monthly breakdown for the year
    const monthlyQuery = `
      SELECT 
        MONTH(TC.NgayToChuc) AS month,
        COUNT(DISTINCT TC.ID_TiecCuoi) AS weddingCount,
        SUM(HD.TienThanhToan) AS revenue
      FROM TiecCuoi TC
      JOIN HoaDon HD ON TC.ID_TiecCuoi = HD.ID_TiecCuoi
      WHERE YEAR(TC.NgayToChuc) = @year
      GROUP BY MONTH(TC.NgayToChuc)
      ORDER BY month
    `;
    
    const monthlyResult = await pool.request()
      .input('year', sql.Int, currentYear)
      .query(monthlyQuery);
    
    // Get venue type breakdown
    const venueQuery = `
      SELECT 
        LS.TenLoai AS venueType,
        COUNT(TC.ID_TiecCuoi) AS weddingCount,
        SUM(HD.TienThanhToan) AS revenue
      FROM TiecCuoi TC
      JOIN HoaDon HD ON TC.ID_TiecCuoi = HD.ID_TiecCuoi
      JOIN SanhTiec ST ON TC.ID_SanhTiec = ST.ID_SanhTiec
      JOIN LoaiSanh LS ON ST.ID_LoaiSanh = LS.ID_LoaiSanh
      WHERE YEAR(TC.NgayToChuc) = @year
      GROUP BY LS.TenLoai
      ORDER BY revenue DESC
    `;
    
    const venueResult = await pool.request()
      .input('year', sql.Int, currentYear)
      .query(venueQuery);
    
    // Extract data from results
    const stats = result.recordset[0] || {
      totalWeddings: 0,
      totalRevenue: 0,
      averageRevenue: 0
    };
    
    // Create empty array for all 12 months
    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      weddingCount: 0,
      revenue: 0
    }));
    
    // Fill in the data from the query
    monthlyResult.recordset.forEach(record => {
      allMonths[record.month - 1] = record;
    });
    
    res.status(200).json({
      year: currentYear,
      totalRevenue: stats.totalRevenue || 0,
      totalWeddings: stats.totalWeddings || 0,
      averageRevenue: stats.averageRevenue || 0,
      monthlyBreakdown: allMonths,
      venueBreakdown: venueResult.recordset
    });
  } catch (error) {
    console.error('Error generating yearly report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate yearly report',
      error: error.message
    });
  }
};

// Get revenue trend data for the specified number of months
exports.getRevenueTrend = async (req, res) => {
  try {
    const { months } = req.query;
    const numberOfMonths = parseInt(months) || 6; // Default to 6 months if not specified
    
    // Connect to database
    await pool.connect();
    
    // Calculate the date range (current month and past N months)
    const currentDate = new Date();
    const endDate = endOfMonth(currentDate);
    const startDate = startOfMonth(subMonths(currentDate, numberOfMonths - 1));
    
    // Query to get monthly revenue trend for the specified period
    const revenueQuery = `
      SELECT 
        YEAR(TC.NgayToChuc) AS year,
        MONTH(TC.NgayToChuc) AS month,
        COUNT(DISTINCT TC.ID_TiecCuoi) AS weddingCount,
        SUM(HD.TienThanhToan) AS revenue
      FROM TiecCuoi TC
      JOIN HoaDon HD ON TC.ID_TiecCuoi = HD.ID_TiecCuoi
      WHERE TC.NgayToChuc BETWEEN @startDate AND @endDate
      GROUP BY YEAR(TC.NgayToChuc), MONTH(TC.NgayToChuc)
      ORDER BY YEAR(TC.NgayToChuc), MONTH(TC.NgayToChuc)
    `;
    
    const revenueResult = await pool.request()
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(revenueQuery);
    
    // Create array for all requested months with proper labels
    const allMonths = [];
    for (let i = 0; i < numberOfMonths; i++) {
      const date = subMonths(currentDate, numberOfMonths - 1 - i);
      allMonths.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        label: format(date, 'MM/yyyy'),
        weddingCount: 0,
        revenue: 0
      });
    }
    
    // Fill in the data from the query
    revenueResult.recordset.forEach(record => {
      const index = allMonths.findIndex(
        m => m.year === record.year && m.month === record.month
      );
      if (index !== -1) {
        allMonths[index].weddingCount = record.weddingCount;
        allMonths[index].revenue = record.revenue;
      }
    });
    
    // Calculate additional analytics
    const totalRevenue = allMonths.reduce((sum, month) => sum + (month.revenue || 0), 0);
    const totalWeddings = allMonths.reduce((sum, month) => sum + (month.weddingCount || 0), 0);
    const averageMonthlyRevenue = totalWeddings > 0 ? totalRevenue / numberOfMonths : 0;
    
    res.status(200).json({
      numberOfMonths,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      totalRevenue,
      totalWeddings,
      averageMonthlyRevenue,
      trend: allMonths
    });
  } catch (error) {
    console.error('Error generating revenue trend:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate revenue trend data',
      error: error.message
    });
  }
}; 