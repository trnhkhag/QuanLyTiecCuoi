const { pool } = require('../config/db');

class RegulationService {
    // Lấy tất cả quy định
    async getAllRegulations() {
        try {
            const [regulations] = await pool.query('SELECT * FROM QuyDinh');
            return regulations;
        } catch (error) {
            console.error('Error in getAllRegulations:', error);
            throw error;
        }
    }

    // Lấy chi tiết một quy định
    async getRegulationById(regulationId) {
        try {
            const [regulations] = await pool.query(
                'SELECT * FROM QuyDinh WHERE ID_QuyDinh = ?',
                [regulationId]
            );

            if (regulations.length === 0) {
                throw new Error('Không tìm thấy quy định');
            }

            return regulations[0];
        } catch (error) {
            console.error('Error in getRegulationById:', error);
            throw error;
        }
    }

    // Cập nhật quy định
    async updateRegulation(regulationId, updateData) {
        try {
            await pool.query(
                'UPDATE QuyDinh SET TenQuyDinh = ?, MoTa = ?, GhiChu = ? WHERE ID_QuyDinh = ?',
                [updateData.TenQuyDinh, updateData.MoTa, updateData.GhiChu, regulationId]
            );
            return { message: 'Cập nhật quy định thành công' };
        } catch (error) {
            console.error('Error in updateRegulation:', error);
            throw error;
        }
    }

    // Thêm mới quy định
    async createRegulation(newRegulation) {
        try {
            const { ID_QuyDinh, TenQuyDinh, MoTa, GhiChu } = newRegulation;
            await pool.query(
                'INSERT INTO QuyDinh (ID_QuyDinh, TenQuyDinh, MoTa, GhiChu) VALUES (?, ?, ?, ?)',
                [ID_QuyDinh, TenQuyDinh, MoTa, GhiChu]
            );
            return { message: 'Thêm mới quy định thành công' };
        } catch (error) {
            console.error('Error in createRegulation:', error);
            throw error;
        }
    }

    // Xóa quy định
    async deleteRegulation(regulationId) {
        try {
            await pool.query('DELETE FROM QuyDinh WHERE ID_QuyDinh = ?', [regulationId]);
            return { message: 'Xóa quy định thành công' };
        } catch (error) {
            console.error('Error in deleteRegulation:', error);
            throw error;
        }
    }
}

module.exports = new RegulationService();