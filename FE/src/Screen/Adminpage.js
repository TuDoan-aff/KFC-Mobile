import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminPage = ({ navigation }) => {

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  }

  const handleLogout = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', onPress: async () => {
        await AsyncStorage.multiRemove(['userInfo', 'userToken']);
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      }},
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trang Quản Trị</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#e74c3c' }]}
          onPress={() => handleNavigate('AdminPanel')}
        >
          <Text style={styles.buttonText}>Quản lý sản phẩm</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#3498db' }]}
          onPress={() => handleNavigate('Adminorder')}
        >
          <Text style={styles.buttonText}>Quản lý đơn hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#27ae60' }]}
          onPress={() => handleNavigate('Adminacc')}
        >
          <Text style={styles.buttonText}>Quản lý tài khoản</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default AdminPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    marginBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#c0392b',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '90%',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // cho Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
