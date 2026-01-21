import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  LayoutAnimation,
  UIManager,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@react-native-vector-icons/ionicons';

// Kích hoạt animation cho Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const userData = await AsyncStorage.getItem('userInfo');
      if (userData) setUser(JSON.parse(userData));
      else setUser(null);
    });
    return unsubscribe;
  }, [navigation]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleLogout = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        onPress: async () => {
          await AsyncStorage.multiRemove(['userInfo', 'userToken']);
          setUser(null);
          Alert.alert('Đã đăng xuất');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài khoản của bạn</Text>
      </View>

      {/* Thông tin user */}
      <View style={styles.profileBox}>
        {user ? (
          <>
            <Ionicons name="person-circle-outline" size={80} color="#e4002b" />
            <Text style={styles.name}>Xin chào, {user.username || user.user?.username} 👋</Text>
            <Text style={styles.subText}>Chúc bạn một ngày ngon miệng 🍗</Text>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Ionicons name="person-circle-outline" size={80} color="#ccc" />
            <Text style={styles.subText}>Bạn chưa đăng nhập</Text>
            <View style={styles.authContainer}>
              <TouchableOpacity
                style={[styles.authButton, { backgroundColor: '#e4002b' }]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.authText}>Đăng nhập</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.authButton, { backgroundColor: '#fff', borderColor: '#e4002b', borderWidth: 1 }]}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={[styles.authText, { color: '#e4002b' }]}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Danh mục menu */}
      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Tài khoản & Cài đặt</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="person-outline" size={22} color="#e4002b" />
          <Text style={styles.menuText}>Thông tin cá nhân</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('AboutmeScreen')}
        >
          <Ionicons name="information-circle-outline" size={22} color="#e4002b" />
          <Text style={styles.menuText}>Về KFC Việt Nam</Text>
        </TouchableOpacity>

        {/* Dropdown Chính sách */}
        <View style={styles.policyBlock}>
          <TouchableOpacity style={styles.policyHeader} onPress={toggleExpand}>
            <Ionicons name="document-text-outline" size={22} color="#e4002b" />
            <Text style={styles.menuText}>Chính sách</Text>
            <Ionicons
              name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={20}
              color="#555"
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.policyList}>
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('PrivateScreen')}
              >
                <Text style={styles.text}>Chính sách bảo mật</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('RegulationsScreen')}
              >
                <Text style={styles.text}>Chính sách đổi trả</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('CookieScreen')}
              >
                <Text style={styles.text}>Điều khoản sử dụng</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Contact')}
        >
          <Ionicons name="call-outline" size={22} color="#e4002b" />
          <Text style={styles.menuText}>Liên hệ & Góp ý</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('MyorderScreen')}
        >
          <Ionicons name="restaurant-outline" size={22} color="#e4002b" />
          <Text style={styles.menuText}>Đơn hàng của tôi</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Phiên bản 1.0.0</Text>
        <Text style={styles.footerText}>© 2025 KFC Việt Nam</Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },

  header: {
    backgroundColor: '#e4002b',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },

  profileBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 16,
    paddingVertical: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#111', marginTop: 5 },
  subText: { color: '#777', marginTop: 5, fontSize: 15 },
  authContainer: { flexDirection: 'row', gap: 10, marginTop: 15 },
  authButton: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 25,
    alignItems: 'center',
  },
  authText: { fontWeight: 'bold', color: '#fff', fontSize: 15 },
  logoutButton: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e4002b',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: '#e4002b',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },

  menuContainer: {
    borderTopWidth: 8,
    borderTopColor: '#f4f4f4',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  menuTitle: { fontSize: 15, color: '#999', marginBottom: 10, marginLeft: 5 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  menuText: { fontSize: 16, color: '#333', marginLeft: 10, fontWeight: '500' },

  policyBlock: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
  },
  policyList: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingLeft: 40,
    paddingVertical: 5,
  },
  item: { paddingVertical: 10 },
  text: { fontSize: 15, color: '#555' },

  footer: { alignItems: 'center', paddingVertical: 25 },
  footerText: { fontSize: 13, color: '#999' },
});
