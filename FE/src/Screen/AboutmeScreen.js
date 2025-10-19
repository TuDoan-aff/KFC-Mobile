import React from 'react';
import { ScrollView, Text, StyleSheet, Dimensions, View,ImageBackground } from 'react-native';
import Header from './Header';


const AboutmeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
     <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require('../Images/logo.jpg')} // ảnh nền đỏ trắng
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Trà đá Phương Hạnh — Hương vị thân quen giữa lòng phố
            </Text>

            <Text style={styles.paragraph}>
              “Trà đá Phương Hạnh” là điểm dừng chân quen thuộc của mọi người,
              nơi ly trà mát lạnh giúp xua tan cái nắng trưa oi ả và mang lại
              cảm giác thân quen, giản dị như chính con người Việt Nam.
            </Text>

            <Text style={styles.paragraph}>
              Từ những ly trà truyền thống đến các món nước sáng tạo, chúng tôi
              luôn giữ trọn hương vị tự nhiên, thanh mát, và tận tâm trong từng
              khâu pha chế.
            </Text>

            <Text style={styles.paragraph}>
              Hãy ghé qua “Trà đá Phương Hạnh” — nơi bạn không chỉ uống trà, mà
              còn tìm thấy sự thư giãn, tiếng cười và những câu chuyện đời
              thường giản đơn.
            </Text>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

export default AboutmeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 45,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  logo: {
    width: 80,
    height: 50,
    resizeMode: 'contain',
  },
  background: {
    width: '100%',
    minHeight: 1000, // cho phép cuộn dài
    justifyContent: 'flex-start',
  },
  textContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // làm sáng phần chữ
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d9232e',
    marginBottom: 10,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
    textAlign: 'justify',
  },
});