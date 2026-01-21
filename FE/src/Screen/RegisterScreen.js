import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../config'; 

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword || !phone) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu nhập lại không khớp!');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        username,
        email,
        password,
        phone,
        role: 'user',
      });

      Alert.alert('🎉 Thành công', response.data.message || 'Đăng ký thành công!');
      navigation.replace('Login');
    } catch (error) {
      console.log('Register error:', error.response?.data || error.message);
      Alert.alert('Đăng ký thất bại', error.response?.data?.message || error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../Images/logo.jpg')}
          style={styles.logo}
        />
        <Text style={styles.title}>Tạo tài khoản</Text>
        <Text style={styles.subtitle}>Gia nhập đại gia đình KFC Việt Nam 🍗</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Tên người dùng"
          placeholderTextColor="#999"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Mật khẩu"
          placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TextInput
          placeholder="Số điện thoại"
          placeholderTextColor="#999"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Đăng ký</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Đã có tài khoản?{' '}
            <Text style={styles.loginHighlight}>Đăng nhập ngay</Text>
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
    textAlign: 'center',
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
  registerButton: {
    backgroundColor: '#d81f26',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#d81f26',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 15,
    color: '#444',
  },
  loginHighlight: {
    color: '#d81f26',
    fontWeight: 'bold',
  },
});
