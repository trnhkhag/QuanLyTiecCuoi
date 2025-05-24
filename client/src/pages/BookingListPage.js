import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, IconButton, 
  TextField, Grid, InputAdornment,
  MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useBookingForm } from '../hooks/Booking/useBookings';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PrintIcon from '@mui/icons-material/Print';

// Styled components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: status === 'Đã thanh toán' ? '#4caf50' : '#ff9800',
  color: '#fff',
  fontWeight: 'bold',
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.spacing(1),
}));

/**
 * Trang danh sách đặt tiệc cưới
 */
function BookingListPage() {
  const { 
    bookings, 
    loading, 
    error,
    filters,
    updateFilter,
    applyFilters,
    resetFilters,
  } = useBookingForm();

  // Biến đếm để hiển thị số lượng đặt tiệc
  const bookingCount = bookings ? bookings.length : 0;
  
  // Hàm định dạng ngày tháng thành tiếng Việt
  const formatDate = (date) => {
    if (!date) return '';
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      console.error('Lỗi format ngày', error);
      return date;
    }
  };

  // Hàm tạo URL để in hóa đơn
  const getInvoiceUrl = (bookingId) => `/invoices/${bookingId}`;

  // Hàm định dạng số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Hiển thị thông báo nếu không có dữ liệu
  if (bookings.length === 0 && !loading) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
          Danh sách đặt tiệc cưới
        </Typography>
        
        <FilterSection>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Ngày tổ chức"
                value={filters.date}
                onChange={(newDate) => updateFilter('date', newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tên khách hàng"
                variant="outlined"
                value={filters.customerName}
                onChange={(e) => updateFilter('customerName', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="status-filter-label">Trạng thái thanh toán</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  label="Trạng thái thanh toán"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="pending">Chưa thanh toán còn lại</MenuItem>
                  <MenuItem value="completed">Đã thanh toán</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={applyFilters}
              >
                Tìm kiếm
              </Button>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={resetFilters}
              >
                Đặt lại
              </Button>
            </Grid>
          </Grid>
        </FilterSection>
        
        <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
          <Typography variant="h6" color="textSecondary">
            Không tìm thấy đặt tiệc nào.
          </Typography>
          <Button 
            component={Link} 
            to="/bookings/new" 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
          >
            Tạo đặt tiệc mới
          </Button>
        </Paper>
      </Container>
    );
  }

  // Hiển thị thông báo đang tải
  if (loading) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
          Đang tải danh sách đặt tiệc...
        </Typography>
      </Container>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
          Đã xảy ra lỗi
        </Typography>
        <Typography color="error" align="center">
          {error}
        </Typography>
        <Box textAlign="center" mt={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </Box>
      </Container>
    );
  }

  // Render danh sách đặt tiệc
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Danh sách tiệc cưới
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Tổng số: <b>{bookingCount}</b> tiệc cưới
          </Typography>
          
          <Button 
            component={Link} 
            to="/bookings/new" 
            variant="contained" 
            color="primary"
          >
            Đặt tiệc mới
          </Button>
        </Box>
        
        <FilterSection>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Ngày tổ chức"
                value={filters.date}
                onChange={(newDate) => updateFilter('date', newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tên khách hàng"
                variant="outlined"
                value={filters.customerName}
                onChange={(e) => updateFilter('customerName', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="status-filter-label">Trạng thái thanh toán</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  label="Trạng thái thanh toán"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="pending">Chưa thanh toán còn lại</MenuItem>
                  <MenuItem value="completed">Đã thanh toán</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={applyFilters}
              >
                Tìm kiếm
              </Button>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={resetFilters}
              >
                Đặt lại
              </Button>
            </Grid>
          </Grid>
        </FilterSection>
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Bảng danh sách tiệc cưới">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Ngày tổ chức</TableCell>
                <TableCell>Sảnh</TableCell>
                <TableCell>Ca</TableCell>
                <TableCell>Số bàn</TableCell>
                <TableCell>Tình trạng</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <StyledTableRow key={booking.ID_TiecCuoi}>
                  <TableCell>#{booking.ID_TiecCuoi}</TableCell>
                  <TableCell>{booking.TenKhachHang}</TableCell>
                  <TableCell>{formatDate(booking.NgayToChuc)}</TableCell>
                  <TableCell>{booking.TenSanh}</TableCell>
                  <TableCell>{booking.TenCa}</TableCell>
                  <TableCell>{booking.SoLuongBan}</TableCell>
                  <TableCell>
                    <StatusChip 
                      label={booking.TrangThai} 
                      status={booking.TrangThai}
                      icon={booking.TrangThai === 'Đã thanh toán' ? <CheckCircleIcon /> : <ErrorIcon />}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      component={Link} 
                      to={`/bookings/${booking.ID_TiecCuoi}`} 
                      color="primary" 
                      aria-label="xem chi tiết"
                      title="Xem chi tiết"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    
                    <IconButton 
                      component={Link} 
                      to={`/bookings/${booking.ID_TiecCuoi}/edit`} 
                      color="secondary"
                      aria-label="chỉnh sửa"
                      title="Chỉnh sửa đặt tiệc"
                    >
                      <EditIcon />
                    </IconButton>
                    
                    <IconButton 
                      component={Link} 
                      to={getInvoiceUrl(booking.ID_TiecCuoi)}
                      color="info"
                      aria-label="hóa đơn"
                      title="In hóa đơn"
                    >
                      <PrintIcon />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default BookingListPage;