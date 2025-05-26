import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class PDFService {
  /**
   * Generate PDF from invoice data
   * @param {Object} invoice - Invoice data
   * @returns {Promise} - PDF generation promise
   */
  async generateInvoicePDF(invoice) {
    try {
      // Create a temporary div to render invoice content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '20px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      // Generate HTML content for PDF
      tempDiv.innerHTML = this.generateInvoiceHTML(invoice);
      
      // Add to document
      document.body.appendChild(tempDiv);
      
      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove temporary div
      document.body.removeChild(tempDiv);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Download PDF
      const fileName = `HoaDon_${invoice.ID_HoaDon}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      return { success: true, fileName };
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Không thể tạo file PDF. Vui lòng thử lại.');
    }
  }

  /**
   * Generate HTML content for invoice PDF
   * @param {Object} invoice - Invoice data
   * @returns {string} - HTML string
   */
  generateInvoiceHTML(invoice) {
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      }).format(amount);
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    };

    const calculatePercentage = () => {
      return Math.round((invoice.TienThanhToan / invoice.TongTien) * 100);
    };

    const hasPenalty = () => {
      return invoice.TienPhat && invoice.TienPhat > 0;
    };

    return `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
          <h1 style="color: #333; margin: 0; font-size: 28px;">TRUNG TÂM TIỆC CƯỚI</h1>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">Điện thoại: (028) 1234 5678 | Email: info@tiecCuoi.com</p>
        </div>

        <!-- Invoice Title -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #d4a574; margin: 0; font-size: 24px;">HÓA ĐƠN THANH TOÁN</h2>
          <p style="margin: 10px 0; font-size: 16px;">Số hóa đơn: <strong>#${invoice.ID_HoaDon}</strong></p>
          <p style="margin: 5px 0; color: #666;">Ngày lập: ${formatDate(invoice.NgayLap)}</p>
        </div>

        <!-- Invoice Type Badge -->
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="
            display: inline-block;
            padding: 8px 16px;
            background-color: ${invoice.LoaiHoaDon === 'Thanh toán đặt cọc' ? '#e8f5e8' : '#fff3cd'};
            color: ${invoice.LoaiHoaDon === 'Thanh toán đặt cọc' ? '#155724' : '#856404'};
            border: 1px solid ${invoice.LoaiHoaDon === 'Thanh toán đặt cọc' ? '#c3e6cb' : '#ffeaa7'};
            border-radius: 4px;
            font-weight: bold;
          ">
            ${invoice.LoaiHoaDon}
          </span>
        </div>

        <!-- Wedding Information -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px;">
            THÔNG TIN TIỆC CƯỚI
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; width: 30%; font-weight: bold;">Mã tiệc cưới:</td>
              <td style="padding: 8px 0;">${invoice.ID_TiecCuoi}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Ngày tổ chức:</td>
              <td style="padding: 8px 0;">${formatDate(invoice.NgayToChuc)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Ca tiệc:</td>
              <td style="padding: 8px 0;">${invoice.TenCa || 'N/A'}</td>
            </tr>
          </table>
        </div>

        <!-- Payment Information -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px;">
            THÔNG TIN THANH TOÁN
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; width: 30%; font-weight: bold;">Tổng tiền:</td>
              <td style="padding: 8px 0; font-size: 16px; color: #333;">${formatCurrency(invoice.TongTien)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Tiền thanh toán:</td>
              <td style="padding: 8px 0; font-size: 16px; color: #d4a574; font-weight: bold;">${formatCurrency(invoice.TienThanhToan)}</td>
            </tr>
            ${hasPenalty() ? `
              <tr style="background-color: #fff5f5;">
                <td style="padding: 8px 0; font-weight: bold; color: #dc3545;">Số ngày trễ hạn:</td>
                <td style="padding: 8px 0; color: #dc3545;">${invoice.SoNgayTreHan} ngày</td>
              </tr>
              <tr style="background-color: #fff5f5;">
                <td style="padding: 8px 0; font-weight: bold; color: #dc3545;">Tiền phạt (1%/ngày):</td>
                <td style="padding: 8px 0; color: #dc3545; font-weight: bold;">${formatCurrency(invoice.TienPhat)}</td>
              </tr>
              <tr style="background-color: #fff5f5; border-top: 2px solid #dc3545;">
                <td style="padding: 12px 0; font-weight: bold; color: #dc3545; font-size: 16px;">Tổng phải thanh toán:</td>
                <td style="padding: 12px 0; color: #dc3545; font-weight: bold; font-size: 18px;">${formatCurrency(invoice.TongTien + invoice.TienPhat)}</td>
              </tr>
            ` : ''}
          </table>
        </div>

        <!-- Payment Progress -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px;">
            TIẾN ĐỘ THANH TOÁN
          </h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">Đã thanh toán:</span>
            <span style="font-weight: bold; color: #d4a574;">${calculatePercentage()}%</span>
          </div>
          <div style="
            width: 100%;
            height: 20px;
            background-color: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #ddd;
          ">
            <div style="
              width: ${calculatePercentage()}%;
              height: 100%;
              background: linear-gradient(90deg, #d4a574, #f4d03f);
              transition: width 0.3s ease;
            "></div>
          </div>
        </div>

        <!-- Notes -->
        ${invoice.GhiChu ? `
          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px;">
              GHI CHÚ
            </h3>
            <p style="
              padding: 15px;
              background-color: #f8f9fa;
              border-left: 4px solid #d4a574;
              margin: 0;
              font-style: italic;
            ">
              ${invoice.GhiChu}
            </p>
          </div>
        ` : ''}

        <!-- Footer -->
        <div style="margin-top: 50px; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
          <p style="margin: 5px 0; color: #666; font-size: 12px;">
            Hóa đơn được tạo tự động bởi hệ thống quản lý tiệc cưới
          </p>
          <p style="margin: 5px 0; color: #666; font-size: 12px;">
            Ngày in: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}
          </p>
        </div>
      </div>
    `;
  }
}

export default new PDFService(); 