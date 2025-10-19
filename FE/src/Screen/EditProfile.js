import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import BASE_URL from '../config';
import { useNavigation } from '@react-navigation/native';

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState({
        username: '',
        email: '',
        phone: '',
        position: '',
        image: '',
    });
    const [loading, setLoading] = useState(true);

    // 🔹 Lấy thông tin user khi vào trang
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const stored = await AsyncStorage.getItem('userInfo');
                console.log('Stored userInfo:', stored);

                if (!stored) {
                    Alert.alert('⚠️ Chưa đăng nhập!');
                    navigation.goBack();
                    return;
                }

                const parsed = JSON.parse(stored);
                const id = parsed.id || parsed._id; // ✅ Sửa ở đây

                if (!id) {
                    Alert.alert('❌ Không tìm thấy ID người dùng');
                    return;
                }

                setUserId(id);

                const res = await axios.get(`${BASE_URL}/users/${id}`);

                if (res.data) {
                    setUser({
                        username: res.data.username || '',
                        email: res.data.email || '',
                        phone: res.data.phone || '',
                        position: res.data.position || '',
                        image: res.data.image || '',
                    });
                } else {
                    Alert.alert('❌ Không có dữ liệu người dùng');
                }
            } catch (error) {
                console.error('❌ Lỗi tải user:', error.response?.data || error.message);
                Alert.alert('Không thể tải thông tin người dùng.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // 🔹 Chọn ảnh đại diện
    const handleChooseAvatar = () => {
        const options = { mediaType: 'photo', quality: 0.8 };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) return;
            if (response.errorCode) {
                Alert.alert('Không thể chọn ảnh.');
                return;
            }
            const uri = response.assets?.[0]?.uri;
            if (uri) setUser({ ...user, image: uri });
        });
    };

    // 🔹 Lưu thông tin cập nhật
    const handleSave = async () => {
        try {
            if (!userId) return Alert.alert('Không xác định được người dùng.');

            const res = await axios.put(`${BASE_URL}/users/${userId}`, user);

            if (res.status === 200) {
                Alert.alert('✅ Cập nhật thành công!');
                await AsyncStorage.setItem('userInfo', JSON.stringify(res.data));
            } else {
                Alert.alert('⚠️ Không thể cập nhật người dùng.');
            }
        } catch (error) {
            console.error('❌ Lỗi lưu thông tin:', error.response?.data || error.message);
            Alert.alert('❌ Lỗi khi lưu thay đổi!');
        }
    };

    if (loading)
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E4002B" />
                <Text style={{ color: '#333', marginTop: 10 }}>Đang tải thông tin...</Text>
            </View>
        );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>🍗 Hồ sơ cá nhân KFC</Text>

            <TouchableOpacity onPress={handleChooseAvatar} style={styles.avatarWrapper}>
                <Image
                    source={{
                        uri: user.image || 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.changePhoto}>Thay ảnh đại diện</Text>
            </TouchableOpacity>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="👤 Tên người dùng"
                    value={user.username}
                    onChangeText={(t) => setUser({ ...user, username: t })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="📞 Số điện thoại"
                    value={user.phone}
                    onChangeText={(t) => setUser({ ...user, phone: t })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="📧 Email"
                    value={user.email}
                    onChangeText={(t) => setUser({ ...user, email: t })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Địa chỉ"
                    value={user.address}
                    onChangeText={(t) => setUser({ ...user, address: t })}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>💾 Lưu thay đổi</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#E4002B',
        textAlign: 'center',
        marginVertical: 25,
        letterSpacing: 1,
    },
    avatarWrapper: {
        alignItems: 'center',
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: '#E4002B',
        marginBottom: 10,
    },
    changePhoto: {
        color: '#E4002B',
        fontWeight: '700',
        textDecorationLine: 'underline',
        marginBottom: 25,
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#eee',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#fafafa',
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#E4002B',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#E4002B',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
