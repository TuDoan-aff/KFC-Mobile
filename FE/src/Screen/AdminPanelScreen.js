import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

const AdminPanelScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: '',
    img: '',
    price: '',
    description: '',
    hot: false,
  });
  const [editingId, setEditingId] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Kiểm tra quyền
  useEffect(() => {
    const checkUser = async () => {
      const stored = await AsyncStorage.getItem('userInfo');
      if (!stored) return navigation.goBack();
      const parsed = JSON.parse(stored);
      if (parsed.role !== 'admin' && parsed.role !== 'employee') {
        Alert.alert('⚠️', 'Bạn không có quyền quản lý sản phẩm');
        return navigation.goBack();
      }
      setUser(parsed);
    };
    checkUser();
  }, []);

  // Lấy sản phẩm
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Thêm / sửa sản phẩm
  const handleSave = async () => {
    if (!form.name || !form.category || !form.img || !form.price) {
      return Alert.alert('⚠️', 'Vui lòng nhập đầy đủ thông tin bắt buộc');
    }
    try {
      setLoading(true);
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await axios.put(`${BASE_URL}/products/${editingId}`, payload);
        Alert.alert('✅', 'Cập nhật thành công');
      } else {
        await axios.post(`${BASE_URL}/products/add`, payload);
        Alert.alert('✅', 'Thêm sản phẩm thành công');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      Alert.alert('❌', 'Không thể lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Chọn sửa sản phẩm
  const handleEdit = (item) => {
    setForm({
      name: item.name || '',
      category: item.category || '',
      img: item.img || item.image || '',
      price: item.price?.toString() || '',
      description: item.description || '',
      hot: item.hot || false,
    });
    setEditingId(item._id);
  };

  const resetForm = () => {
    setForm({ name: '', category: '', img: '', price: '', description: '', hot: false });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    Alert.alert('Xóa sản phẩm', 'Bạn có chắc muốn xóa?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: async () => {
        try { await axios.delete(`${BASE_URL}/products/${id}`); fetchProducts(); } 
        catch (err) { console.error(err); Alert.alert('❌ Lỗi'); }
      }},
    ]);
  };

  

  // 🔹 Lọc + phân trang
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        
        {/* Form + Tìm kiếm */}
        <Text style={styles.title}>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</Text>
        <TextInput
          placeholder="🔍 Tìm kiếm sản phẩm..."
          value={searchText}
          onChangeText={text => { setSearchText(text); setCurrentPage(1); }}
          style={[styles.input, { marginBottom: 15 }]}
        />
        {['name', 'category', 'img', 'price', 'description'].map((key) => (
          <View key={key} style={{ marginBottom: 10 }}>
            <TextInput
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={form[key]}
              onChangeText={(text) => setForm({ ...form, [key]: text })}
              style={styles.input}
            />
            {key === 'img' && form.img ? (
              <Image source={{ uri: form.img }} style={styles.previewImage} resizeMode="cover" />
            ) : null}
          </View>
        ))}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
          <TouchableOpacity style={[styles.saveButton, { flex: 1, marginRight: 5 }]} onPress={handleSave}>
            <Text style={styles.saveText}>{editingId ? 'Cập nhật' : 'Thêm'}</Text>
          </TouchableOpacity>
          {editingId && (
            <TouchableOpacity style={[styles.cancelButton, { flex: 1, marginLeft: 5 }]} onPress={resetForm}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Danh sách sản phẩm */}
        <Text style={[styles.title, { marginTop: 10 }]}>Danh sách sản phẩm</Text>
        {paginatedProducts.map((item) => (
          <View key={item._id} style={styles.item}>
            <Image source={{ uri: item.img || item.image }} style={styles.itemImage}/>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text>{item.category} - {item.price} đ</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.edit}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text style={styles.delete}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Phân trang */}
        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={styles.pageButton}
            >
              <Text style={styles.pageButtonText}>‹ Trước</Text>
            </TouchableOpacity>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <TouchableOpacity key={num} onPress={() => setCurrentPage(num)} style={[styles.pageButton, currentPage===num && { backgroundColor: 'darkred' }]}>
                <Text style={styles.pageButtonText}>{num}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              style={styles.pageButton}
            >
              <Text style={styles.pageButtonText}>Tiếp ›</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Overlay Loading */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="red" />
        </View>
      )}
    </View>
  );
};

export default AdminPanelScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  previewImage: { width: 120, height: 120, marginTop: 5, borderRadius: 8 },
  saveButton: { backgroundColor: 'red', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '600' },
  cancelButton: { backgroundColor: 'gray', padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelText: { color: '#fff', fontWeight: '600' },
  item: { padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 10 },
  itemName: { fontWeight: '600', fontSize: 16 },
  itemImage: { width: 80, height: 80, marginTop: 5, borderRadius: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 },
  edit: { marginRight: 15, color: 'blue' },
  delete: { color: 'red' },
  paginationContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' },
  pageButton: {
    backgroundColor: '#e4002b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginHorizontal: 3,
    marginVertical: 3,
  },
  pageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});