// navigation/PolicyStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CookieScreen from './CookieScreen';
import PrivateScreen from './PrivateScreen';
import RegulationsScreen from './RegulationsScreen';
import ProfileScreen from '../ProfileScreen';

const Stack = createNativeStackNavigator();


const PolicyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CookieScreen" component={CookieScreen} options={{ title: 'Chính Sách' }} />
      <Stack.Screen name="PrivateScreen" component={PrivateScreen} options={{ title: 'Chính sách bảo mật' }} />
      <Stack.Screen name="RegulationsScreen" component={RegulationsScreen} options={{ title: 'Chính sách đổi trả' }} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Thêm' }} />
    </Stack.Navigator>
  );
};

export default PolicyStack;
