import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Alert, ScrollView, ActivityIndicator, Dimensions
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import GetLocation from 'react-native-get-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

Mapbox.setAccessToken('sk.eyJ1IjoibWluaHR1MjAwMyIsImEiOiJjbWtseGh0a2MwMnkxM2VzZWo0eHBtaGcxIn0.tR7-rOnv-blDOdtpbjCPKw');

const CheckoutScreen = ({ route, navigation }) => {
    // Nhận total từ params
    const { cartItems, total } = route.params; 
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);
    const [coordinates, setCoordinates] = useState([105.8542, 21.0285]);

    useEffect(() => {
        const loadUser = async () => {
            const stored = await AsyncStorage.getItem('userInfo');
            if (stored) {
                const user = JSON.parse(stored);
                setName(user.username || '');
                setPhone(user.phone || '');
            }
        };
        loadUser();
    }, []);

    const handleGetLocation = () => {
        setLocating(true);
        GetLocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 })
            .then(location => {
                setCoordinates([location.longitude, location.latitude]);
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`,
                    { headers: { 'User-Agent': 'KFC-App' } })
                    .then(res => res.json())
                    .then(data => setAddress(data.display_name))
                    .catch(() => Alert.alert("Lỗi", "Không thể lấy địa chỉ"));
            })
            .catch(() => Alert.alert("Lỗi", "Hãy bật GPS trên máy ảo"))
            .finally(() => setLocating(false));
    };

const handlePlaceOrder = async () => {
  if (!address || !phone || !name) {
    Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin giao hàng");
    return;
  }

  setLoading(true);
  try {
    const storedUser = await AsyncStorage.getItem('userInfo');
    if (!storedUser) {
      navigation.navigate('Login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const token = parsedUser.token;
    const userId = parsedUser.id || parsedUser._id; // Lấy ID để xóa giỏ hàng

    const orderData = {
      name,
      phone,
      address,
      note,
      items: cartItems,
      totalAmount: total,
      paymentMethod,
      status: 'Pending',
    };

    // 1. Gửi đơn hàng lên server
    const res = await axios.post(`${BASE_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 201 || res.status === 200) {
      
      // 2. THÊM Ở ĐÂY: Xóa giỏ hàng trên Database
      // Giả sử API xóa của bạn là DELETE: BASE_URL/cart/userId
      try {
        await axios.delete(`${BASE_URL}/cart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("✅ Đã xóa giỏ hàng trên Database");
      } catch (cartErr) {
        console.log("⚠️ Lỗi xóa giỏ hàng DB (nhưng đơn hàng đã tạo):", cartErr);
      }

      // 3. Xóa giỏ hàng ở bộ nhớ máy (AsyncStorage)
      await AsyncStorage.removeItem('cartItems');

      Alert.alert("Thành công", "🍗 Đơn hàng KFC đã được đặt thành công!");

      // 4. Quay về trang chủ và reset stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  } catch (error) {
    console.log("Lỗi Server trả về:", error.response?.data);
    Alert.alert("Lỗi đặt hàng", error.response?.data?.message || "Lỗi kết nối máy chủ");
  } finally {
    setLoading(false);
  }
};

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📍 Thông tin giao hàng</Text>
                    <TextInput placeholder="Họ và tên" value={name} onChangeText={setName} style={styles.input} />
                    <TextInput placeholder="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />

                    <View style={styles.addressWrapper}>
                        <TextInput
                            placeholder="Địa chỉ nhận hàng"
                            value={address}
                            onChangeText={setAddress}
                            style={[styles.input, { paddingRight: 80 }]}
                            multiline
                        />
                        <TouchableOpacity style={styles.locBtn} onPress={handleGetLocation}>
                            {locating ? <ActivityIndicator size="small" color="red" /> : <Text style={styles.locBtnText}>Vị trí</Text>}
                        </TouchableOpacity>
                    </View>
                    <TextInput placeholder="Ghi chú" value={note} onChangeText={setNote} style={styles.input} />
                </View>

                <View style={styles.mapContainer}>
                    <Mapbox.MapView style={styles.map} logoEnabled={false} attributionEnabled={false}>
                        <Mapbox.Camera
                            zoomLevel={15}
                            centerCoordinate={coordinates}
                            animationMode={'flyTo'}
                            animationDuration={2000}
                        />
                        <Mapbox.PointAnnotation id="userLocation" coordinate={coordinates}>
                            <View style={styles.markerContainer}>
                                <View style={styles.markerInner} />
                            </View>
                        </Mapbox.PointAnnotation>
                    </Mapbox.MapView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💳 Phương thức thanh toán</Text>
                    <View style={styles.row}>
                        {['COD', 'MoMo', 'ZaloPay'].map(m => (
                            <TouchableOpacity
                                key={m}
                                style={[styles.methodBtn, paymentMethod === m && styles.activeMethod]}
                                onPress={() => setPaymentMethod(m)}
                            >
                                <Text style={[styles.methodText, paymentMethod === m && { color: '#FFF' }]}>{m}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <View>
                    <Text style={{ color: '#666' }}>Tổng thanh toán</Text>
                    <Text style={styles.totalText}>{total ? total.toLocaleString() : 0} đ</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.orderBtn, loading && { backgroundColor: '#ccc' }]} 
                    onPress={handlePlaceOrder}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.orderBtnText}>ĐẶT HÀNG</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: { backgroundColor: '#FFF', padding: 15, marginTop: 10, marginHorizontal: 15, borderRadius: 15, elevation: 2 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#222' },
    input: { backgroundColor: '#F1F3F5', borderRadius: 10, padding: 12, marginBottom: 10, fontSize: 15, color: '#000' },
    addressWrapper: { position: 'relative' },
    locBtn: { position: 'absolute', right: 8, top: 10, padding: 8, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: 'red', zIndex: 10 },
    locBtnText: { color: 'red', fontWeight: 'bold', fontSize: 12 },
    mapContainer: { height: 200, marginHorizontal: 15, marginTop: 10, borderRadius: 15, overflow: 'hidden', elevation: 2 },
    map: { flex: 1 },
    markerContainer: { height: 30, width: 30, backgroundColor: 'rgba(255, 0, 0, 0.2)', borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    markerInner: { height: 12, width: 12, backgroundColor: 'red', borderRadius: 6, borderWidth: 2, borderColor: '#fff' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    methodBtn: { flex: 1, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#DDD', borderRadius: 10, marginHorizontal: 4 },
    activeMethod: { backgroundColor: 'red', borderColor: 'red' },
    methodText: { fontWeight: '600', color: '#555' },
    bottomBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 20 },
    totalText: { fontSize: 20, fontWeight: 'bold', color: 'red' },
    orderBtn: { backgroundColor: 'red', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
    orderBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default CheckoutScreen;