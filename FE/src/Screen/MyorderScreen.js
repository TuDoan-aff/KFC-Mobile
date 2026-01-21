import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, 
  TouchableOpacity, Alert, RefreshControl, SafeAreaView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

const STATUS_LABELS = {
  processing: 'Xác nhận',
  pending: 'Chuẩn bị',
  shipped: 'Giao hàng',
  delivered: 'Đã nhận',
  canceled: 'Đã hủy',
};

const STATUS_COLORS = {
  processing: '#3498db',
  pending: '#f39c12',
  shipped: '#2980b9',
  delivered: '#27ae60',
  canceled: '#e74c3c',
};

const STATUS_ORDER = ['processing', 'pending', 'shipped', 'delivered'];

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      if (!refreshing) setLoading(true);
      const storedUser = await AsyncStorage.getItem('userInfo');
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      const res = await axios.get(`${BASE_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('❌ Lỗi fetchOrders:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, []);

  const renderProgressBar = (currentStatus) => {
    if (currentStatus === 'canceled') {
      return (
        <View style={styles.cancelStatus}>
          <Text style={styles.cancelText}>Đơn hàng này đã bị hủy</Text>
        </View>
      );
    }

    return (
      <View style={styles.progressWrapper}>
        <View style={styles.progressContainer}>
          {STATUS_ORDER.map((s, index) => {
            const isReached = STATUS_ORDER.indexOf(currentStatus) >= index;
            const isCurrent = currentStatus === s;
            return (
              <View key={s} style={styles.stepWrapper}>
                <View style={styles.nodeRow}>
                   {/* Đường nối */}
                  {index !== 0 && (
                    <View style={[styles.connector, { backgroundColor: isReached ? STATUS_COLORS[currentStatus] : '#E0E0E0' }]} />
                  )}
                  {/* Vòng tròn trạng thái */}
                  <View style={[
                    styles.circle, 
                    { backgroundColor: isReached ? STATUS_COLORS[currentStatus] : '#fff', 
                      borderColor: isReached ? STATUS_COLORS[currentStatus] : '#E0E0E0' 
                    },
                    isCurrent && styles.currentCircle
                  ]}>
                    {isReached && <View style={styles.innerDot} />}
                  </View>
                </View>
                <Text style={[styles.stepLabel, isReached && { color: '#2D3436', fontWeight: 'bold' }]}>
                  {STATUS_LABELS[s]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
      </View>

      <ScrollView 
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#e74c3c']} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#e74c3c" style={{ marginTop: 50 }} />
        ) : orders.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Chưa có đơn hàng nào 🍗</Text>
          </View>
        ) : (
          orders.map(order => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Mã: #{order._id.slice(-6).toUpperCase()}</Text>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[order.status] + '20' }]}>
                  <Text style={[styles.badgeText, { color: STATUS_COLORS[order.status] }]}>
                    {STATUS_LABELS[order.status]}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.infoRow}>📍 <Text style={styles.infoText}>{order.customer?.address || order.address || 'Hà Nội'}</Text></Text>
                <Text style={styles.infoRow}>💰 <Text style={styles.infoText}>{order.totalAmount?.toLocaleString()} đ</Text></Text>
                {order.customer?.note && (
                  <Text style={styles.infoRow}>📝 <Text style={styles.infoNote}>{order.customer.note}</Text></Text>
                )}
              </View>

              {renderProgressBar(order.status)}

              <View style={styles.cardFooter}>
                <TouchableOpacity style={styles.detailButton}>
                  <Text style={styles.detailButtonText}>Xem chi tiết</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2D3436' },
  container: { flex: 1, padding: 12 },
  
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderId: { fontSize: 15, fontWeight: 'bold', color: '#636E72' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },

  cardBody: { borderBottomWidth: 1, borderBottomColor: '#F1F3F5', paddingBottom: 12 },
  infoRow: { fontSize: 14, marginBottom: 4, color: '#2D3436' },
  infoText: { color: '#2D3436' },
  infoNote: { color: '#B2BEC3', fontStyle: 'italic' },

  // Progress Bar Styles
  progressWrapper: { marginTop: 15, marginBottom: 5 },
  progressContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  stepWrapper: { alignItems: 'center', flex: 1 },
  nodeRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' },
  connector: { height: 2, flex: 1, position: 'absolute', right: '50%', width: '100%', zIndex: -1 },
  circle: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  currentCircle: { transform: [{ scale: 1.2 }], borderWidth: 3 },
  innerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  stepLabel: { fontSize: 10, marginTop: 8, color: '#B2BEC3' },

  cancelStatus: { backgroundColor: '#FFF5F5', padding: 10, borderRadius: 8, alignItems: 'center' },
  cancelText: { color: '#E74C3C', fontWeight: 'bold' },

  cardFooter: { marginTop: 12 },
  detailButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E74C3C',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center'
  },
  detailButtonText: { color: '#E74C3C', fontWeight: 'bold', fontSize: 14 },
  emptyBox: { marginTop: 100, alignItems: 'center' },
  emptyText: { color: '#B2BEC3', fontSize: 16 }
});