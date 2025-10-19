import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Text, Image, StyleSheet,
  TouchableOpacity, Dimensions, ScrollView
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../config.js';
import Anh1 from '../Images/banner1.jpg';
import Anh2 from '../Images/banner2.jpg';
import Anh3 from '../Images/banner3.jpg';
import Anh4 from '../Images/banner4.jpg';
import Anh5 from '../Images/logo1.jpg';


const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const screenWidth = Dimensions.get('window').width;

  const Images = [Anh1, Anh2, Anh3, Anh4];

  const categories = [
    'Combo 1 Người',
    'Combo Nhóm',
    'Gà Rán',
    'Burger - Cơm - Mì Ý',
    'Thức Ăn Nhẹ',
    'Thức Uống & Tráng Miệng',
  ];

  const categoryImages = {
    'Combo 1 Người': require('../Images/1.jpg'),
    'Combo Nhóm': require('../Images/nhom.jpg'),
    'Gà Rán': require('../Images/garan.jpg'),
    'Burger - Cơm - Mì Ý': require('../Images/burger.jpg'),
    'Thức Ăn Nhẹ': require('../Images/thhucan.jpg'),
    'Thức Uống & Tráng Miệng': require('../Images/nuoc.jpg'),
  };

  // Lấy sản phẩm từ MongoDB qua BE
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      setData(response.data);
    } catch (error) {
      console.error("❌ Lỗi khi tải sản phẩm:", error);
    }

  };

  // Gọi API khi vào màn hình
  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto chuyển ảnh banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const hotProducts = data.filter((product) => product.hot === true);
  return (
    <View>
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

      <ScrollView style={{ marginBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Phần trên */}
        <View style={styles.header1}>
          <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>
            Đặt Ngay <Ionicons name="bicycle" size={25} color="white" /> Giao Hàng Tận hoặc Mang đi
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CategoryScreen')}>
            <Text style={styles.buttonText}>Bắt đầu đặt hàng</Text>
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <Image
          source={Images[currentIndex]}
          style={{ width: screenWidth, height: 411 }}
          resizeMode="contain"
        />

        {/* Danh mục */}
        <Text style={styles.mainword}>DANH MỤC MÓN ĂN -------------------------</Text>

        <View style={styles.categoryContainer}>
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryCard,
                selectedCategory === item ,
              ]}
              onPress={() => {
                setSelectedCategory(item);
                navigation.navigate('CategoryScreen', { selectedCategory: item });
              }}
            >
              <Image source={categoryImages[item]} style={styles.categoryImage} />
              <Text style={styles.categoryTitle}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Gợi ý món hot */}
        <View style={styles.bottom}>
          <Image source={Anh5} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.text}>CÓ THỂ BẠN SẼ THÍCH MÓN NÀY</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 9, paddingLeft: 10 }}
        >
          {hotProducts.map((item) => (
            <View key={item._id} style={styles.hotItem}>
              <TouchableOpacity
                onPress={() => navigation.navigate('DetailScreen', { id: item._id || item.id })}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.hotImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              <Text style={styles.hotItemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: 'gray',
                  borderRadius: 10,
                  width: 140,
                  top: 10,
                  alignItems: 'center',
                }}
                onPress={() => navigation.navigate('CartScreen', { id: item._id || item.id })}
              >
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 15,
                    margin: 8,
                  }}
                >
                  Thêm
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

      </ScrollView>
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
  mainword: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  itemImage: {
    width: 100,
    height: 90,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  categoryContainer: {
    paddingHorizontal: 12,
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
  },

  categoryImage: {
    width: '100%',
    height: 120,
    marginBottom: 8,
    resizeMode: 'cover',
  },

  categoryTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  hotBadge: {
    backgroundColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },

  hotText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    color: '#555',
    marginBottom: 5,
  },
  itemPrice: {
    color: 'green',
    fontWeight: 'bold',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

  },
  image: {
    width: 80,
    height: 90,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
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
  hotItem: {
    width: 200,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    elevation: 3,

  },

  hotImage: {
    width: 150,
    height: 130,
    borderRadius: 8,
  },

  hotItemName: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
    color: '#333',
  },

});

export default HomeScreen;
