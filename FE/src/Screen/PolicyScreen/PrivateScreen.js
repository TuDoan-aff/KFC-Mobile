import React from 'react';
import { ScrollView, Text, StyleSheet, Dimensions, View,ImageBackground } from 'react-native';
import Header from '../Header';


const PrivateScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Chính sách quyền riêng tư</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default PrivateScreen;
