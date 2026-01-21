import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import BASE_URL from '../config.js';
import Ionicons from '@react-native-vector-icons/ionicons';
import axios from 'axios';

const DetailScreen = ({ navigation, route }) => {
  const { id } = route.params || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError('❌ Lỗi khi tải sản phẩm');
      console.error('❌ Lỗi khi tải sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.loaderContainer}>
        <Text>{error || 'Không tìm thấy sản phẩm'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {product.image ? (
        <Image 
          source={{ uri: product.image }} 
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' }]}> 
          <Ionicons name="image-outline" size={64} color="#999" />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price || 0)}
        </Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>

      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={() => navigation.navigate('CartScreen', { productId: product._id })}
      >
        <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 320,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  addToCartButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 20,
    backgroundColor: 'red',
    borderRadius: 50,
    paddingVertical: 12,
    gap: 8,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
