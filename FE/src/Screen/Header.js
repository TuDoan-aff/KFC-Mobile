import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const Header =() => {
  return (
     <View style={styles.header}>
        <Image
          source={require('../Images/logo.jpg')}
          style={{ width: 80, height: 60, marginTop: 10, marginLeft: 10 }}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Thêm')}>
          <Ionicons name="person-circle-sharp" size={33} color="black" />
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
});

export default Header;
