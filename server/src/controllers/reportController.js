const { pool, execute } = require('../config/db');
const { format, parseISO, startOfMonth, endOfMonth, subMonths } = require('date-fns');

// Get monthly report data
exports.getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentYear = parseInt(year) || new Date().getFullYear();
    const currentMonth = parseInt(month) || new Date().getMonth() + 1;
    
    // Validate month parameter
    if (month !== undefined) {
      const monthNum = parseInt(month);
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({
          success: false,
          message: 'Tháng phải từ 1 đến 12'
        });
      }
    }
    
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
      WHERE TC.NgayToChuc BETWEEN ? AND ?
    `;
    
    const result = await execute(query, [startDate, endDate]);
    
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
      WHERE TC.NgayToChuc BETWEEN ? AND ?
      GROUP BY LS.TenLoai
      ORDER BY revenue DESC
    `;
    
    const venueResult = await execute(venueQuery, [startDate, endDate]);
    
    // Get service usage statistics
    const serviceQuery = `
      SELECT 
        DV.TenDichVu AS serviceName,
        COUNT(TD.ID_TiecCuoi) AS usageCount,
        SUM(TD.SoLuong * TD.DonGia) AS revenue
      FROM TiecCuoi TC
      JOIN Tiec_DichVu TD ON TC.ID_TiecCuoi = TD.ID_TiecCuoi
      JOIN DichVu DV ON TD.ID_DichVu = DV.ID_DichVu
      WHERE TC.NgayToChuc BETWEEN ? AND ?
      GROUP BY DV.TenDichVu
      ORDER BY revenue DESC
    `;
    
    const serviceResult = await execute(serviceQuery, [startDate, endDate]);
    
    // Extract data from results
    const stats = result[0] || {
      totalWeddings: 0,
      totalRevenue: 0,
      averageRevenue: 0
    };
    
    res.status(200).json({
      success: true,
      data: {
      year: currentYear,
      month: currentMonth,
        totalRevenue: parseFloat(stats.totalRevenue) || 0,
        totalWeddings: parseInt(stats.totalWeddings) || 0,
        averageRevenue: parseFloat(stats.averageRevenue) || 0,
      venueBreakdown: venueResult,
      serviceBreakdown: serviceResult
      }
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
      WHERE YEAR(TC.NgayToChuc) = ?
    `;
    
    const result = await execute(query, [currentYear]);
    
    // Query to get monthly breakdown for the year
    const monthlyQuery = `
      SELECT 
        MONTH(TC.NgayToChuc) AS month,
        COUNT(DISTINCT TC.ID_TiecCuoi) AS weddingCount,
        SUM(HD.TienThanhToan) AS revenue
      FROM TiecCuoi TC
      JOIN HoaDon HD ON TC.ID_TiecCuoi = HD.ID_TiecCuoi
      WHERE YEAR(TC.NgayToChuc) = ?
      GROUP BY MONTH(TC.NgayToChuc)
      ORDER BY month
    `;
    
    const monthlyResult = await execute(monthlyQuery, [currentYear]);
    
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
      WHERE YEAR(TC.NgayToChuc) = ?
      GROUP BY LS.TenLoai
      ORDER BY revenue DESC
    `;
    
    const venueResult = await execute(venueQuery, [currentYear]);
    
    // Extract data from results
    const stats = result[0] || {
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
    monthlyResult.forEach(record => {
      allMonths[record.month - 1] = {
        month: record.month,
        weddingCount: parseInt(record.weddingCount) || 0,
        revenue: parseFloat(record.revenue) || 0
      };
    });
    
    res.status(200).json({
      success: true,
      data: {
      year: currentYear,
        totalRevenue: parseFloat(stats.totalRevenue) || 0,
        totalWeddings: parseInt(stats.totalWeddings) || 0,
        averageRevenue: parseFloat(stats.averageRevenue) || 0,
      monthlyBreakdown: allMonths,
      venueBreakdown: venueResult
      }
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
    const { months, month, year } = req.query;
    
    // Parse and validate numberOfMonths parameter
    let numberOfMonths = 6; // Default value
    if (months !== undefined) {
      numberOfMonths = parseInt(months);
      if (isNaN(numberOfMonths) || numberOfMonths <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Số tháng phải lớn hơn 0'
        });
      }
    }
    
    // Calculate the date range based on the specified month and year, or use current date
    let currentDate;
    if (month && year) {
      currentDate = new Date(parseInt(year), parseInt(month) - 1);
    } else {
      currentDate = new Date();
    }
    
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
      WHERE TC.NgayToChuc BETWEEN ? AND ?
      GROUP BY YEAR(TC.NgayToChuc), MONTH(TC.NgayToChuc)
      ORDER BY YEAR(TC.NgayToChuc), MONTH(TC.NgayToChuc)
    `;
    
    const revenueResult = await execute(revenueQuery, [startDate, endDate]);
    
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
    revenueResult.forEach(record => {
      const index = allMonths.findIndex(
        m => m.year === record.year && m.month === record.month
      );
      if (index !== -1) {
        allMonths[index].weddingCount = parseInt(record.weddingCount) || 0;
        allMonths[index].revenue = parseFloat(record.revenue) || 0;
      }
    });
    
    // Calculate additional analytics
    const totalRevenue = allMonths.reduce((sum, month) => sum + parseFloat(month.revenue || 0), 0);
    const totalWeddings = allMonths.reduce((sum, month) => sum + parseInt(month.weddingCount || 0), 0);
    const averageMonthlyRevenue = numberOfMonths > 0 ? totalRevenue / numberOfMonths : 0;
    
    res.status(200).json({
      success: true,
      data: {
      numberOfMonths,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      totalRevenue,
      totalWeddings,
      averageMonthlyRevenue,
      trend: allMonths
      }
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