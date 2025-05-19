import React from 'react';
import { Table } from 'react-bootstrap';
import { FormattedPrice } from '../common/StatusComponents';

/**
 * Component để hiển thị tóm tắt đơn đặt tiệc
 */
function BookingSummary({ 
  formData, 
  halls, 
  foods, 
  calculateTotal, 
  deposit, 
  handleDepositChange 
}) {
  // Tính tổng chi phí
  const totalCost = calculateTotal();
  
  // Tìm thông tin sảnh đã chọn
  const selectedHall = halls.find(h => h.id.toString() === formData.hallId) || {};
  
  // Tính chi phí món ăn
  const foodCost = formData.selectedFoods.reduce((total, foodId) => {
    const food = foods.find(f => f.id === foodId);
    return total + (food ? food.pricePerTable * formData.tableCount : 0);
  }, 0);
  
  // Tính chi phí dịch vụ
  const serviceCost = formData.selectedServices.reduce((total, service) => {
    return total + (service.price * service.quantity);
  }, 0);
  
  // Đề xuất tiền đặt cọc (50% tổng chi phí)
  const recommendedDeposit = Math.round(totalCost * 0.5);
  
  return (
    <div className="booking-summary">
      <h5 className="mb-3">Tổng chi phí dự kiến</h5>
      
      <Table borderless>
        <tbody>
          <tr>
            <td>Sảnh tiệc:</td>
            <td>{selectedHall.name || 'Chưa chọn'}</td>
            <td className="text-end">
              {selectedHall.price ? (
                <FormattedPrice amount={selectedHall.price} />
              ) : '-'}
            </td>
          </tr>
          
          <tr>
            <td>Số lượng bàn:</td>
            <td>{formData.tableCount} bàn chính + {formData.reserveTableCount} bàn dự trữ</td>
            <td className="text-end"></td>
          </tr>
          
          <tr>
            <td>Chi phí món ăn:</td>
            <td>{formData.selectedFoods.length} món</td>
            <td className="text-end">
              <FormattedPrice amount={foodCost} />
            </td>
          </tr>
          
          <tr>
            <td>Chi phí dịch vụ:</td>
            <td>{formData.selectedServices.length} dịch vụ</td>
            <td className="text-end">
              <FormattedPrice amount={serviceCost} />
            </td>
          </tr>
          
          <tr className="fw-bold">
            <td>Tổng chi phí dự kiến:</td>
            <td></td>
            <td className="text-end">
              <FormattedPrice amount={totalCost} />
            </td>
          </tr>
        </tbody>
      </Table>
      
      <hr />
      
      <div className="mb-3">
        <label htmlFor="deposit" className="form-label">Tiền đặt cọc</label>
        <input
          type="number"
          className="form-control"
          id="deposit"
          name="deposit"
          value={deposit}
          onChange={handleDepositChange}
          min="0"
        />
        <div className="form-text">
          Đề xuất: <FormattedPrice amount={recommendedDeposit} /> (50%)
        </div>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mt-4">
        <span>Còn lại:</span>
        <span className="fs-5 fw-bold">
          <FormattedPrice amount={totalCost - formData.deposit} />
        </span>
      </div>
    </div>
  );
}

export default BookingSummary;
