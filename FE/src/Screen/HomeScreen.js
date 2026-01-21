import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet,
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

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      setData(response.data);
    } catch (error) {
      console.error("❌ Lỗi khi tải sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [Images.length]);

  const hotProducts = data.filter((product) => product.hot === true);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
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

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
              style={styles.categoryCard}
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
              <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('CartScreen', { id: item._id || item.id })}
              >
                <Text style={styles.addButtonText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* NÚT CHAT NỔI */}
      <TouchableOpacity 
        style={styles.chatButton} 
        onPress={() => navigation.navigate('ChatBotScreen')}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubble-ellipses" size={30} color="white" />
        <View style={styles.onlineDot} />
      </TouchableOpacity>
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
  itemDescription: {
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 12,
    paddingHorizontal: 5
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
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
  hotItem: {
    width: 200,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 10
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
  addButton: {
    backgroundColor: 'gray',
    borderRadius: 10,
    width: 140,
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 8
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'red',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 999,
  },
  onlineDot: {
    position: 'absolute',
    top: 2,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2ecc71',
    borderWidth: 2,
    borderColor: '#fff',
  }
});

export default HomeScreen;