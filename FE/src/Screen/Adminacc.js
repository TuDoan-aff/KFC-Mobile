import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Image 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

import BASE_URL from '../config'; 

const AccountManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  // Lấy token admin từ AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('adminToken');
      if (!storedToken) {
        Alert.alert('Lỗi', 'Bạn chưa đăng nhập admin');
        return;
      }
      setToken(storedToken);
    };
    getToken();
  }, []);

  // Fetch user
  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Không thể tải danh sách user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  // Thay đổi role
  const handleChangeRole = async (userId, newRole) => {
    try {
      await axios.put(`${BASE_URL}/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Không thể thay đổi quyền');
    }
  };

  // Xóa user
  const handleDeleteUser = (userId) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa user này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: async () => {
        try {
          await axios.delete(`${BASE_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchUsers();
        } catch (err) {
          console.error(err);
          Alert.alert('Error', 'Không thể xóa user');
        }
      }}
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{item.username}</Text>
          <Text>{item.email}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Picker
          selectedValue={item.role}
          style={{ height: 50, width: 140 }}
          onValueChange={(value) => handleChangeRole(item._id, value)}
        >
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Employee" value="employee" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteUser(item._id)}>
          <Text style={{ color: 'white' }}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
};

export default AccountManagementScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 3
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12, backgroundColor: '#ccc' },
  username: { fontWeight: 'bold', fontSize: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deleteBtn: {
    backgroundColor: 'red',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4
  }
});
