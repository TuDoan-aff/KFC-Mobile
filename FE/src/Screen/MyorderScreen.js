import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

const STATUS_LABELS = {
  processing: 'Chờ xác nhận',
  pending: 'Đang chuẩn bị',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  canceled: 'Đã hủy',
};

const STATUS_COLORS = {
  processing: '#3498db',
  pending: '#f39c12',
  shipped: '#3498db',
  delivered: '#2ecc71',
  canceled: '#e74c3c',
};

const STATUS_ORDER = ['processing', 'pending', 'shipped', 'delivered'];

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // 1️⃣ Lấy userInfo từ AsyncStorage
      const storedUser = await AsyncStorage.getItem('userInfo');
      if (!storedUser) {
        console.warn('User chưa login');
        Alert.alert('Thông báo', 'Vui lòng đăng nhập để xem đơn hàng.');
        return;
      }

      const user = JSON.parse(storedUser);
      const token = user.token;
      if (!token) {
        console.warn('Token chưa có trong userInfo');
        Alert.alert('Thông báo', 'Token không hợp lệ. Vui lòng đăng nhập lại.');
        return;
      }

      console.log('Token sẵn sàng gửi:', token);

      // 2️⃣ Gửi request với Authorization header
      const res = await axios.get(`${BASE_URL}/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Orders data:', res.data);
      setOrders(res.data);

    } catch (err) {
      console.error('❌ Lỗi fetchOrders:', err.response?.data || err.message);
      Alert.alert('Lỗi', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderProgressBar = (status) => {
    return (
      <View style={styles.progressContainer}>
        {STATUS_ORDER.map((s, index) => {
          const reached = STATUS_ORDER.indexOf(status) >= index;
          return (
            <View key={s} style={styles.progressStep}>
              <View style={[styles.circle, { backgroundColor: reached ? STATUS_COLORS[s] : '#ccc' }]} />
              {index !== STATUS_ORDER.length - 1 && (
                <View style={[styles.line, { backgroundColor: reached ? STATUS_COLORS[s] : '#ccc' }]} />
              )}
              <Text style={styles.stepLabel}>{STATUS_LABELS[s]}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : orders.length === 0 ? (
        <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
      ) : (
        orders.map(order => (
          <View key={order._id} style={styles.orderCard}>
            <Text style={styles.orderTitle}>Đơn hàng #{order._id.slice(-6)}</Text>
            <Text>Địa chỉ nhận: {order.customer?.address || 'Chưa có'}</Text>
  {order.customer?.note ? <Text>Ghi chú: {order.customer.note}</Text> : null}
            <Text>Tổng: {order.totalAmount?.toLocaleString()} đ</Text>

            {/* Thanh tiến trình */}
            {renderProgressBar(order.status)}

            <TouchableOpacity style={styles.detailButton}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Xem chi tiết</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefefe', padding: 10 },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  orderTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },

  progressContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  progressStep: { alignItems: 'center', flex: 1 },
  circle: { width: 20, height: 20, borderRadius: 10 },
  line: { height: 4, flex: 1, marginHorizontal: 2, marginTop: -10 },
  stepLabel: { fontSize: 12, marginTop: 8, textAlign: 'center' },

  detailButton: {
    marginTop: 10,
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center'
  },
});
