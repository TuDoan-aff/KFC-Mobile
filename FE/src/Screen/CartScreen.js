import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);

  // 🧠 Lấy thông tin người dùng
  useFocusEffect(
  useCallback(() => {
    const getUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('userInfo');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          console.log('✅ User info:', parsed);
        } else {
          Alert.alert('Thông báo', 'Bạn cần đăng nhập để xem giỏ hàng!', [
            { text: 'Đăng nhập', onPress: () => navigation.navigate('Thêm') },
          ]);
        }
      } catch (err) {
        console.error('❌ Lỗi khi lấy user:', err);
      }
    };
    getUser();
  }, [navigation])
);

  // 🧾 Lấy giỏ hàng
  const fetchCartItems = async (userId) => {
    try {
      const res = await axios.get(`${BASE_URL}/cart/${userId}`);
      const items = res.data.map((item) => ({
        ...item,
        quantity: item.quantity > 0 ? item.quantity : 1,
      }));
      setCartItems(items);
    } catch (error) {
      console.error('❌ Lỗi khi lấy giỏ hàng:', error);
    }
  };

  // Gọi API sau khi có user
  useEffect(() => {
    if (user?.id || user?._id) {
      const userId = user._id || user.id;
      fetchCartItems(userId);
    }
  }, [user]);

  // 📦 Cập nhật số lượng
  const handleQuantityChange = async (itemId, change) => {
    try {
      const updated = cartItems.map((item) =>
        item._id === itemId ? { ...item, quantity: Math.max(item.quantity + change, 1) } : item
      );
      setCartItems(updated);

      const updatedItem = updated.find((item) => item._id === itemId);
      await axios.put(`${BASE_URL}/cart/update/${itemId}`, {
        quantity: updatedItem.quantity,
      });
    } catch (error) {
      console.error('❌ Lỗi cập nhật số lượng:', error);
    }
  };

  // ❌ Xoá sản phẩm
  const handleRemoveItem = async (itemId) => {
    Alert.alert('Xoá sản phẩm', 'Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            const userId = user._id || user.id;
            await axios.delete(`${BASE_URL}/cart/${userId}/${itemId}`);
            setCartItems((prev) => prev.filter((item) => item._id !== itemId));
          } catch (error) {
            console.error('❌ Lỗi khi xoá sản phẩm:', error);
          }
        },
      },
    ]);
  };

  // 💰 Tính tổng tiền
  useEffect(() => {
    const sum = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  }, [cartItems]);

  useFocusEffect(
    useCallback(() => {
      if (user?._id || user?.id) {
        const userId = user._id || user.id;
        fetchCartItems(userId);
      }
    }, [user])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>
      </View>

      <ScrollView style={styles.cartList}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống 😢</Text>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item._id} style={styles.cartItem}>
              <Image source={{ uri: item.img }} style={styles.image} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price.toLocaleString()} đ</Text>
              </View>

              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => handleQuantityChange(item._id, -1)}>
                  <Text style={styles.qtyButton}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => handleQuantityChange(item._id, 1)}>
                  <Text style={styles.qtyButton}>＋</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item._id)}
              >
                <Text style={styles.removeText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalAmount}>{total.toLocaleString()} đ</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() =>
              navigation.navigate('CheckoutScreen', {
                cartItems,
                total,
                onCheckoutComplete: async () => {
                  await AsyncStorage.removeItem('cartItems');
                  setCartItems([]);
                  setTotal(0);
                },
              })
            }
          >
            <Text style={styles.checkoutText}>Đặt hàng</Text>
          </TouchableOpacity>


        </View>
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingVertical: 18, alignItems: 'center', backgroundColor: 'red' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  cartList: { padding: 15 },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    marginBottom: 15,
    padding: 12,
    elevation: 1,
  },
  image: { width: 70, height: 70, borderRadius: 10, marginRight: 10 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#333' },
  itemPrice: { color: '#ff5b00', marginTop: 5, fontWeight: 'bold' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: { fontSize: 22, color: '#ff5b00', paddingHorizontal: 10 },
  qtyText: { fontSize: 16, fontWeight: '500' },
  removeButton: { marginLeft: 8 },
  removeText: { fontSize: 18 },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: { fontSize: 16, color: '#333' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#ff5b00' },
  checkoutButton: {
    backgroundColor: 'red',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 16, color: '#666' },
});
