import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });

      if (response.data?.token) {
        const { user, token } = response.data;

        // Lưu token cùng userInfo
        await AsyncStorage.setItem('userInfo', JSON.stringify({ ...user, token }));

        if (user.role === 'admin' || user.role === 'employee') {
          Alert.alert('Chào mừng Admin!', 'Đăng nhập thành công!');
          navigation.reset({ index: 0, routes: [{ name: 'Adminpage' }] });
        } else {
          Alert.alert('Đăng nhập thành công!');
          navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
        }

      } else {
        Alert.alert('Lỗi', response.data?.message || 'Phản hồi không hợp lệ từ máy chủ.');
      }
    } catch (error) {
      console.log('Login error:', error.response?.data || error.message);
      Alert.alert('Đăng nhập thất bại', error.response?.data?.message || 'Lỗi kết nối máy chủ');
    }
  };



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../Images/logo.jpg')} style={styles.logo} />
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Đăng nhập để tiếp tục đặt món 🍗</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Mật khẩu"
          placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
          <Text style={styles.registerText}>
            Chưa có tài khoản? <Text style={styles.registerHighlight}>Đăng ký ngay</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#d81f26',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginTop: 5,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#d81f26',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#d81f26',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 15,
    color: '#444',
  },
  registerHighlight: {
    color: '#d81f26',
    fontWeight: 'bold',
  },
});
