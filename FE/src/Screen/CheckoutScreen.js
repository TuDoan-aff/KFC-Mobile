    import React, { useState, useEffect } from 'react';
    import {
        View,
        Text,
        TextInput,
        TouchableOpacity,
        StyleSheet,
        Alert,
        ScrollView,
        ActivityIndicator
    } from 'react-native';
    import axios from 'axios';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import BASE_URL from '../config';


    const CheckoutScreen = ({ route, navigation }) => {
        const { cartItems, total, onCheckoutComplete } = route.params;
        const [address, setAddress] = useState('');
        const [phone, setPhone] = useState('');
        const [note, setNote] = useState('');
        const [paymentMethod, setPaymentMethod] = useState('COD');
        const [loading, setLoading] = useState(false);
        const [name, setName] = useState('');


        // 🔄 Load thông tin user
        useEffect(() => {
            const loadUserInfo = async () => {
                try {
                    const stored = await AsyncStorage.getItem('userInfo');
                    if (stored) {
                        const user = JSON.parse(stored);
                        if (user.username) setName(user.username);
                        if (user.phone) setPhone(user.phone);
                    }
                } catch (error) {
                    console.error("❌ Lỗi khi tải userInfo:", error);
                }
            };
            loadUserInfo();
        }, []);

        const handleOrder = async () => {
            if (!address || !phone) {
                Alert.alert('⚠️ Thiếu thông tin', 'Vui lòng nhập đầy đủ địa chỉ và số điện thoại');
                return;
            }

            try {
                setLoading(true);

                const stored = await AsyncStorage.getItem('userInfo');
                if (!stored) {
                    Alert.alert('Bạn chưa đăng nhập');
                    return;
                }
                const user = JSON.parse(stored);

                const orderData = {
                    customer: {
                        name,
                        email: user.email || '',    // nếu bạn lưu email user
                        phone,
                        address,
                        note,
                    },
                    items: cartItems.map((item) => ({
                        product: item.productId || item._id,  // backend dùng 'product' để ref
                        quantity: item.quantity,
                        price: item.price
                    })),
                    totalAmount: total,
                    note,
                    paymentMethod
                };

                if (paymentMethod === 'MoMo') {
        await createMoMoPayment(total, `ORDER_${Date.now()}`, 'Thanh toán đơn hàng');
        return; // không tạo đơn hàng ngay, chờ callback hoặc xác nhận sau
    }


                const res = await axios.post(`${BASE_URL}/orders`, orderData, {
                    headers: {
                        Authorization: `Bearer ${user.token}`, // ✅ thêm token
                        'Content-Type': 'application/json',
                    },
                });
                if (res.status === 200 || res.status === 201) {
                    Alert.alert('✅ Đặt hàng thành công!', 'Đơn hàng đang được xử lý.', [
                        {
                            text: 'OK',
                            onPress: async () => {
                                try {
                                    // 🔹 Xóa toàn bộ giỏ hàng trên backend
                                    await axios.delete(`${BASE_URL}/cart/${user._id || user.id}`);

                                    // 🔹 Gọi callback để update CartScreen
                                    if (onCheckoutComplete) await onCheckoutComplete();

                                } catch (err) {
                                    console.error('❌ Lỗi khi clear giỏ hàng:', err);
                                } finally {
                                    navigation.goBack();
                                }
                            },
                        },
                    ]);
                } else {
                    Alert.alert('❌ Lỗi khi đặt hàng', res.data?.message || 'Thử lại sau');
                }
            } catch (error) {
                console.error('❌ Lỗi khi đặt hàng:', error);
                Alert.alert('Lỗi', 'Không thể tạo đơn hàng, vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;

        return (
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Thông tin nhận hàng</Text>

                <TextInput
                    placeholder="Tên khách hàng"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Số điện thoại"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={styles.input}
                />
                <TextInput
                    placeholder="Địa chỉ nhận hàng"
                    value={address}
                    onChangeText={setAddress}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Ghi chú (tuỳ chọn)"
                    value={note}
                    onChangeText={setNote}
                    style={styles.input}
                />

                <Text style={styles.title}>Phương thức thanh toán</Text>
                <View style={styles.paymentContainer}>
                    {['COD', 'MoMo', 'PayPal'].map((method) => (
                        <TouchableOpacity
                            key={method}
                            style={[
                                styles.paymentButton,
                                paymentMethod === method && styles.selectedPayment,
                            ]}
                            onPress={() => setPaymentMethod(method)}
                        >
                            <Text
                                style={[
                                    styles.paymentText,
                                    paymentMethod === method && styles.selectedText,
                                ]}
                            >
                                {method}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.summary}>
                    <Text style={styles.summaryText}>Tổng cộng:</Text>
                    <Text style={styles.total}>{total.toLocaleString()} đ</Text>
                </View>

                <TouchableOpacity
                    style={[styles.orderButton, loading && { opacity: 0.7 }]}
                    onPress={handleOrder}
                    disabled={loading}
                >
                    <Text style={styles.orderText}>
                        {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        );
    };

    export default CheckoutScreen;

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: '#fff', padding: 20 },
        title: { fontSize: 18, fontWeight: 'bold', marginTop: 10, color: '#333' },
        input: {
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            padding: 12,
            marginTop: 10,
            fontSize: 16,
        },
        paymentContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 15,
        },
        paymentButton: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
        },
        selectedPayment: {
            backgroundColor: 'red',
            borderColor: 'red',
        },
        paymentText: { color: '#333', fontWeight: '500' },
        selectedText: { color: '#fff' },
        summary: {
            marginTop: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        summaryText: { fontSize: 16, color: '#555' },
        total: { fontSize: 18, fontWeight: 'bold', color: '#ff5b00' },
        orderButton: {
            backgroundColor: 'red',
            padding: 15,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 25,
        },
        orderText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    });
