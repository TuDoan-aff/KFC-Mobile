import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert 
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../config';

const STATUS_LABELS = {
  processing: 'chờ xác nhận',
  pending: 'Đang chuẩn bị',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  canceled: 'Đã hủy',
};

const STATUS_COLORS = {
  pending: '#f39c12',      // cam
  processing: '#3498db',   // xanh dương
  shipped: '#3498db',      // xanh dương
  delivered: '#2ecc71',    // xanh lá
  canceled: '#e74c3c',     // đỏ
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/orders/update/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error(err);
      Alert.alert('❌', 'Cập nhật thất bại');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {['all','processing', 'pending',  'shipped', 'delivered', 'canceled'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && {backgroundColor: '#e74c3c'}]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && {color: '#fff', fontWeight:'bold'}]}>
              {tab === 'all' ? 'Tất cả' : STATUS_LABELS[tab]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Nội dung đơn hàng */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.ordersContainer}>
          {filteredOrders.length === 0 ? (
            <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
          ) : (
            filteredOrders.map(order => (
              <View key={order._id} style={styles.orderCard}>
                <Text style={styles.orderTitle}>Đơn hàng #{order._id.slice(-6)}</Text>
                <Text>Khách hàng: {order.customer?.name || order.customer?.email}</Text>
                <Text>Địa chỉ: {order.customer?.address}</Text>
                <Text>Ghi chú: {order.customer?.note}</Text>
                <Text>Tổng: {order.totalAmount?.toLocaleString()} đ</Text>
                <Text style={{marginVertical:5, fontWeight:'600'}}>Trạng thái: {STATUS_LABELS[order.status]}</Text>

                <View style={styles.statusButtons}>
                  {Object.keys(STATUS_LABELS).map(status => (
                    <TouchableOpacity
                      key={status}
                      style={[styles.statusButton, {backgroundColor: STATUS_COLORS[status]}, order.status === status && {borderWidth:2, borderColor:'#000'}]}
                      onPress={() => updateStatus(order._id, status)}
                    >
                      <Text style={[styles.statusButtonText, {color:'#fff'}]}>
                        {STATUS_LABELS[status]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default AdminOrders;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', paddingTop: 10 },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 10, marginBottom: 10 },
  tabButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#ddd', marginRight: 10 },
  tabText: { fontSize: 14, color: '#333' },
  ordersContainer: { paddingHorizontal: 10, paddingBottom: 20 },
  orderCard: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 4, 
    elevation: 3 
  },
  orderTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  statusButtons: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  statusButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 15, marginRight: 8, marginBottom: 8 },
  statusButtonText: { fontSize: 12, fontWeight:'600', textAlign:'center' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
});
