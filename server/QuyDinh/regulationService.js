const pool = require('../config/db');

class RegulationService {
    // Lấy tất cả quy định
    async getAllRegulations() {
        try {
            // Try database first
            const [regulations] = await pool.query('SELECT * FROM QuyDinh');
            
            // Lấy thêm chi tiết cho từng quy định từ database
            for (let regulation of regulations) {
                if (regulation.ID_QuyDinh === 'QD1') {
                    const [halls] = await pool.query(
                        'SELECT * FROM QD_Sanh WHERE ID_QuyDinh = ?',
                        [regulation.ID_QuyDinh]
                    );
                    regulation.details = { halls };
                }
                else if (regulation.ID_QuyDinh === 'QD2') {
                    const [serviceConfig] = await pool.query(
                        'SELECT * FROM QD_CaDichVu WHERE ID_QuyDinh = ?',
                        [regulation.ID_QuyDinh]
                    );
                    regulation.details = serviceConfig[0];
                }
                else if (regulation.ID_QuyDinh === 'QD4') {
                    const [penaltyConfig] = await pool.query(
                        'SELECT * FROM QD_PhatTre WHERE ID_QuyDinh = ?',
                        [regulation.ID_QuyDinh]
                    );
                    regulation.details = penaltyConfig[0];
                }
            }
            
            return regulations;
        } catch (error) {
            console.log('Falling back to mock data for regulations');
            // If database fails, use mock data
            return require('../data/mockData').regulations;
        }
    }

    // Lấy chi tiết một quy định
    async getRegulationById(regulationId) {
        try {
            // Try database first
            const [regulations] = await pool.query(
                'SELECT * FROM QuyDinh WHERE ID_QuyDinh = ?',
                [regulationId]
            );

            if (regulations.length === 0) {
                // Check mock data if not found in database
                const mockRegulations = require('../data/mockData').regulations;
                const mockRegulation = mockRegulations.find(r => r.ID_QuyDinh === regulationId);
                if (!mockRegulation) {
                    throw new Error('Không tìm thấy quy định');
                }
                return mockRegulation;
            }

            const regulation = regulations[0];

            // Lấy chi tiết dựa vào loại quy định từ database
            switch (regulation.ID_QuyDinh) {
                case 'QD1':
                    const [halls] = await pool.query(
                        'SELECT * FROM QD_Sanh WHERE ID_QuyDinh = ?',
                        [regulationId]
                    );
                    regulation.details = { halls };
                    break;

                case 'QD2':
                    const [serviceConfig] = await pool.query(
                        'SELECT * FROM QD_CaDichVu WHERE ID_QuyDinh = ?',
                        [regulationId]
                    );
                    regulation.details = serviceConfig[0];
                    break;

                case 'QD4':
                    const [penaltyConfig] = await pool.query(
                        'SELECT * FROM QD_PhatTre WHERE ID_QuyDinh = ?',
                        [regulationId]
                    );
                    regulation.details = penaltyConfig[0];
                    break;
            }

            return regulation;
        } catch (error) {
            if (error.message === 'Không tìm thấy quy định') {
                throw error;
            }
            console.log('Falling back to mock data for regulation:', regulationId);
            // If database fails, use mock data
            const mockRegulations = require('../data/mockData').regulations;
            const mockRegulation = mockRegulations.find(r => r.ID_QuyDinh === regulationId);
            if (!mockRegulation) {
                throw new Error('Không tìm thấy quy định');
            }
            return mockRegulation;
        }
    }

    // Cập nhật quy định
    async updateRegulation(regulationId, updateData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Cập nhật thông tin cơ bản
            await connection.query(
                'UPDATE QuyDinh SET MoTa = ?, GhiChu = ? WHERE ID_QuyDinh = ?',
                [updateData.description, updateData.note || null, regulationId]
            );

            // Cập nhật chi tiết dựa vào loại quy định
            switch (regulationId) {
                case 'QD1':
                    // Xóa các cấu hình cũ
                    await connection.query(
                        'DELETE FROM QD_Sanh WHERE ID_QuyDinh = ?',
                        [regulationId]
                    );

                    // Thêm cấu hình mới
                    if (updateData.details?.halls) {
                        const hallValues = updateData.details.halls.map(hall => [
                            regulationId,
                            hall.type,
                            hall.minPrice
                        ]);
                        
                        await connection.query(
                            'INSERT INTO QD_Sanh (ID_QuyDinh, LoaiSanh, GiaBanToiThieu) VALUES ?',
                            [hallValues]
                        );
                    }
                    break;

                case 'QD2':
                    await connection.query(
                        `UPDATE QD_CaDichVu 
                         SET SoLuongDichVuToiDa = ?, SoLuongMonAnToiDa = ?
                         WHERE ID_QuyDinh = ?`,
                        [
                            updateData.details.maxServices,
                            updateData.details.maxDishes,
                            regulationId
                        ]
                    );
                    break;

                case 'QD4':
                    await connection.query(
                        `UPDATE QD_PhatTre 
                         SET TyLePhat = ?, ApDung = ?
                         WHERE ID_QuyDinh = ?`,
                        [
                            updateData.details.lateFeePercentage,
                            updateData.details.enabled,
                            regulationId
                        ]
                    );
                    break;
            }

            await connection.commit();
            return { message: 'Cập nhật quy định thành công' };
        } catch (error) {
            await connection.rollback();
            console.error('Error in updateRegulation:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = new RegulationService();