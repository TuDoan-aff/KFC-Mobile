import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import axios from 'axios';
import BASE_URL from '../config';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = [
  'Combo 1 Người',
  'Combo Nhóm',
  'Gà Rán',
  'Burger - Cơm - Mì Ý',
  'Thức Ăn Nhẹ',
  'Thức Uống & Tráng Miệng',
];

const CategoryScreen = () => {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('Combo 1 Người');
  const flatListRef = useRef();
  const navigation = useNavigation();
  const route = useRoute();

  const categoryFromRoute = route?.params?.selectedCategory || null;

  // 🔹 Lấy danh sách sản phẩm từ MongoDB
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      const products = response.data;

      const grouped = categories.reduce((acc, category) => {
        acc[category] = products.filter(
          (item) =>
            item.category &&
            item.category.toLowerCase() === category.toLowerCase()
        );
        return acc;
      }, {});

      setGroupedData(grouped);
      setData(products);
    } catch (error) {
      console.error('❌ Lỗi khi tải sản phẩm:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Hàm thêm sản phẩm vào giỏ
const handleAddToCart = async (product) => {
  try {
    const storedUser = await AsyncStorage.getItem("userInfo");
    if (!storedUser) {
      Alert.alert(
        "⚠️ Yêu cầu đăng nhập",
        "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.",
        [
          { text: "Hủy", style: "cancel" },
          { text: "Đăng nhập", onPress: () => navigation.navigate("Login") },
        ]
      );
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.id || user._id; // ✅ backend có thể dùng _id hoặc id

    if (!userId) {
      Alert.alert("❌ Không tìm thấy ID người dùng.");
      return;
    }

    // 🔹 Lấy giỏ hàng hiện tại của người dùng
    const cartRes = await axios.get(`${BASE_URL}/cart/${userId}`);
    const cartItems = cartRes.data || [];

    // 🔹 Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = cartItems.find(
      (item) => item.foodId === product._id
    );

    if (existingItem) {
      // ✅ Nếu đã có thì tăng số lượng
      await axios.put(`${BASE_URL}/cart/update/${existingItem._id}`, {
        userId,
        quantity: existingItem.quantity + 1,
      });
      Alert.alert("✅ Đã tăng số lượng sản phẩm trong giỏ hàng!");
    } else {
      // ✅ Nếu chưa có thì thêm mới
      const newItem = {
        userId,
        foodId: product._id,
        name: product.name,
        category: product.category || "Không xác định",
        img: product.image || product.img,
        price: product.price,
        quantity: 1,
      };

      await axios.post(`${BASE_URL}/cart/add`, newItem);
      Alert.alert("✅ Đã thêm sản phẩm vào giỏ hàng!");
    }
  } catch (error) {
    console.error("❌ Lỗi khi thêm vào giỏ:", error);
    Alert.alert("❌ Không thể thêm sản phẩm vào giỏ hàng.");
  }
};



  // ✅ Chuẩn bị dữ liệu cho FlatList
  const flatData = categories.flatMap((category) => [
    { type: 'header', category },
    ...(groupedData[category] || []).map((item) => ({
      ...item,
      type: 'item',
      category,
    })),
  ]);

  // ✅ Cuộn đến danh mục
  const scrollToCategory = (category) => {
    const index = flatData.findIndex(
      (item) => item.type === 'header' && item.category === category
    );
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      setSelectedCategory(category);
    }
  };

  // ✅ Khi nhận params từ màn khác
  useEffect(() => {
    if (categoryFromRoute) {
      setSelectedCategory(categoryFromRoute);
      setTimeout(() => {
        scrollToCategory(categoryFromRoute);
      }, 500);
    }
  }, [categoryFromRoute, flatData]);

  // ✅ Render từng item
  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return <Text style={styles.sectionHeader}>{item.category}</Text>;
    }

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Trang Chủ', {
              screen: 'DetailScreen',
              params: { id: item._id || item.id },
            })
          }
        >
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        </TouchableOpacity>

        <View style={styles.itemContent}>
          {item.hot && (
            <View style={styles.hotBadge}>
              <Text style={styles.hotText}>Hot</Text>
            </View>
          )}
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemPrice}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(item.price)}
          </Text>

          {/* ✅ Nút thêm vào giỏ hàng */}
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../Images/logo.jpg')}
          style={{ width: 80, height: 60, marginTop: 10, marginLeft: 10 }}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Thêm')}>
          <Ionicons name="person-circle-sharp" size={33} color="black" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.header1}>
        <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>
          Đặt Ngay <Ionicons name="bicycle" size={25} color="white" /> Giao Hàng
          Tận Nơi hoặc Mang đi
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Bắt đầu đặt hàng</Text>
        </TouchableOpacity>
      </View>

      {/* Thanh danh mục */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => scrollToCategory(category)}
            style={styles.categoryButton}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategoryText,
              ]}
            >
              {category}
            </Text>
            {selectedCategory === category && <View style={styles.underline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Danh sách sản phẩm */}
      <FlatList
        ref={flatListRef}
        data={flatData}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : `header-${index}`
        }
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    height: 80,
    elevation: 5,
  },
  header1: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    backgroundColor: 'black',
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    width: 350,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  addToCartButton: {
    marginTop: 10,
    backgroundColor: 'gray',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 24,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    paddingBottom: 6,
  },
  activeCategoryText: {
    color: '#e4002b',
  },
  underline: {
    height: 3,
    width: '100%',
    backgroundColor: '#e4002b',
    borderRadius: 2,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    marginLeft: 10,
    color: '#e11d48',
  },
  itemContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemContent: {
    flex: 1,
    padding: 10,
  },
  hotBadge: {
    backgroundColor: 'red',
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    borderRadius: 4,
    marginBottom: 5,
  },
  hotText: {
    color: 'white',
    fontSize: 12,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemDescription: {
    color: '#777',
  },
  itemPrice: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default CategoryScreen;
