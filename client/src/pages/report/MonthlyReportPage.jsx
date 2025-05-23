import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import { 
  LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import DashboardNavbar from '../../components/DashboardNavbar';
import { fetchMonthlyReport, fetchRevenueTrend } from '../../redux/slices/report.slice';
import { formatCurrency } from '../../utils/formatters/currencyFormatter';
import authService from '../../services/authService';
import '../../styles/report.css';

const MonthlyReportPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentDate = new Date();
  
  // Local state for filters
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [activeTab, setActiveTab] = useState('6months'); // Default to 6 months tab
  
  // Get report data from Redux store
  const { 
    monthlyData, 
    revenueTrend, 
    loading,
    error 
  } = useSelector(state => state.reports);
  
  const fetchReportData = useCallback(() => {
    dispatch(fetchMonthlyReport({ year, month }));
    // Get months based on active tab
    const months = activeTab === '6months' ? 6 : activeTab === '9months' ? 9 : 12;
    dispatch(fetchRevenueTrend({ months, month, year }));
  }, [year, month, activeTab, dispatch]);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authService.isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    // Fetch report data when year, month, or active tab changes
    fetchReportData();
  }, [year, month, activeTab, navigate, fetchReportData]);
  
  // Generate year options for the last 5 years and next year
  const yearOptions = [];
  for (let y = currentDate.getFullYear() - 5; y <= currentDate.getFullYear() + 1; y++) {
    yearOptions.push(y);
  }

  return (
    <div className="app-container">
      <DashboardNavbar />
      
      <div className="content-container">
        <div className="report-header">
          <h2>Báo Cáo Tháng</h2>
          
          <div className="report-filters">
            <Form>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Năm</Form.Label>
                    <Form.Select 
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                    >
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Tháng</Form.Label>
                    <Form.Select 
                      value={month}
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <Button 
                    variant="primary" 
                    onClick={fetchReportData}
                    disabled={loading.monthly || loading.trend}
                  >
                    {(loading.monthly || loading.trend) ? 'Đang tải...' : 'Cập nhật'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        
        {/* Display error message if any */}
        {error && (
          <div className="alert alert-danger mt-3">
            {error}
          </div>
        )}
        
        {/* Summary Statistics */}
        <div className="report-summary">
          <Row>
            <Col md={4}>
              <Card className="summary-card">
                <Card.Body>
                  <Card.Title>Tổng doanh thu</Card.Title>
                  <Card.Text className="stat-value">
                    {monthlyData ? formatCurrency(monthlyData.totalRevenue) : 'Đang tải...'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="summary-card">
                <Card.Body>
                  <Card.Title>Số tiệc cưới</Card.Title>
                  <Card.Text className="stat-value">
                    {monthlyData ? monthlyData.totalWeddings : 'Đang tải...'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="summary-card">
                <Card.Body>
                  <Card.Title>Doanh thu trung bình</Card.Title>
                  <Card.Text className="stat-value">
                    {monthlyData ? formatCurrency(monthlyData.averageRevenue) : 'Đang tải...'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
        
        {/* Charts Section with Tabs */}
        <div className="report-charts">
          <Card className="chart-card mt-4">
            <Card.Header>
              <Nav variant="tabs" defaultActiveKey="6months" onSelect={(key) => setActiveTab(key)}>
                <Nav.Item>
                  <Nav.Link eventKey="6months">6 tháng</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="9months">9 tháng</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="12months">12 tháng</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              {loading.trend ? (
                <div className="text-center py-5">Đang tải dữ liệu...</div>
              ) : revenueTrend && revenueTrend.trend && revenueTrend.trend.length > 0 ? (
                <>
                  {/* Additional trend statistics */}
                  <Row className="mb-4">
                    <Col md={4}>
                      <div className="trend-stat">
                        <div className="trend-stat-label">Tổng doanh thu</div>
                        <div className="trend-stat-value">{formatCurrency(revenueTrend.totalRevenue || 0)}</div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="trend-stat">
                        <div className="trend-stat-label">Tổng số tiệc cưới</div>
                        <div className="trend-stat-value">{revenueTrend.totalWeddings || 0}</div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="trend-stat">
                        <div className="trend-stat-label">Doanh thu trung bình hàng tháng</div>
                        <div className="trend-stat-value">{formatCurrency(revenueTrend.averageMonthlyRevenue || 0)}</div>
                      </div>
                    </Col>
                  </Row>
                  {/* Chart */}
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={revenueTrend.trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8884d8" 
                        name="Doanh thu" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <div className="no-data-message">Không có dữ liệu</div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReportPage; 