import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  List,
  Collapse,
  Alert,
  Space,
  Divider,
} from 'antd';
import {
  InfoCircleOutlined,
  BookOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import UserLayout from '../../components/layout/User/UserLayout';
import { LoadingSpinner, ErrorMessage } from '../../components/common/StatusComponents';
import RegulationService from '../../services/RegulationService';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const RegulationPage = () => {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRegulations();
  }, []);

  const fetchRegulations = async () => {
    try {
      setLoading(true);
      const response = await RegulationService.getRegulations();
      if (response.success) {
        setRegulations(response.data);
      } else {
        setError('Không thể tải danh sách quy định');
      }
    } catch (err) {
      console.error('Error fetching regulations:', err);
      setError('Không thể tải danh sách quy định. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <LoadingSpinner text="Đang tải quy định..." />
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <ErrorMessage message={error} />
      </UserLayout>
    );
  }

  // Group regulations by type
  const generalRules = regulations.filter(r => r.LoaiQuyDinh === 'general');
  const bookingRules = regulations.filter(r => r.LoaiQuyDinh === 'booking');
  const paymentRules = regulations.filter(r => r.LoaiQuyDinh === 'payment');

  return (
    <UserLayout>
      <div className="page-container">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="text-center">
            <Title level={2}>Quy định & Điều khoản</Title>
            <Paragraph type="secondary">
              Vui lòng đọc kỹ các quy định trước khi đặt tiệc
            </Paragraph>
          </div>

          <Alert
            message="Lưu ý quan trọng"
            description="Các quy định này có thể thay đổi theo thời gian. Vui lòng kiểm tra lại khi đặt tiệc."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
          />

          <Card bordered={false}>
            <Collapse defaultActiveKey={['1']} ghost>
              <Panel 
                header={
                  <Space>
                    <BookOutlined />
                    <span>Quy định chung</span>
                  </Space>
                } 
                key="1"
              >
                <List
                  dataSource={generalRules}
                  renderItem={item => (
                    <List.Item>
                      <Typography.Text>{item.MoTa}</Typography.Text>
                    </List.Item>
                  )}
                />
              </Panel>

              <Panel 
                header={
                  <Space>
                    <ClockCircleOutlined />
                    <span>Quy định đặt tiệc</span>
                  </Space>
                } 
                key="2"
              >
                <List
                  dataSource={bookingRules}
                  renderItem={item => (
                    <List.Item>
                      <Typography.Text>{item.MoTa}</Typography.Text>
                    </List.Item>
                  )}
                />
              </Panel>

              <Panel 
                header={
                  <Space>
                    <DollarOutlined />
                    <span>Quy định thanh toán</span>
                  </Space>
                } 
                key="3"
              >
                <List
                  dataSource={paymentRules}
                  renderItem={item => (
                    <List.Item>
                      <Typography.Text>{item.MoTa}</Typography.Text>
                    </List.Item>
                  )}
                />
              </Panel>
            </Collapse>
          </Card>

          <Card bordered={false}>
            <Title level={4}>Chính sách hủy đặt tiệc</Title>
            <List>
              <List.Item>
                <Typography.Text>
                  • Hủy trước 30 ngày: Hoàn trả 80% tiền cọc
                </Typography.Text>
              </List.Item>
              <List.Item>
                <Typography.Text>
                  • Hủy trước 15-30 ngày: Hoàn trả 50% tiền cọc
                </Typography.Text>
              </List.Item>
              <List.Item>
                <Typography.Text>
                  • Hủy trước 7-14 ngày: Hoàn trả 30% tiền cọc
                </Typography.Text>
              </List.Item>
              <List.Item>
                <Typography.Text>
                  • Hủy trong vòng 7 ngày: Không hoàn trả tiền cọc
                </Typography.Text>
              </List.Item>
            </List>

            <Divider />

            <Title level={4}>Liên hệ hỗ trợ</Title>
            <Paragraph>
              Nếu bạn có bất kỳ thắc mắc nào về các quy định, vui lòng liên hệ với chúng tôi:
            </Paragraph>
            <List>
              <List.Item>
                <Typography.Text>
                  • Hotline: (028) 1234 5678
                </Typography.Text>
              </List.Item>
              <List.Item>
                <Typography.Text>
                  • Email: support@tieccuoihoanggia.com
                </Typography.Text>
              </List.Item>
              <List.Item>
                <Typography.Text>
                  • Thời gian làm việc: 8:00 - 20:00 (Thứ 2 - Chủ nhật)
                </Typography.Text>
              </List.Item>
            </List>
          </Card>
        </Space>
      </div>
    </UserLayout>
  );
};

export default RegulationPage;