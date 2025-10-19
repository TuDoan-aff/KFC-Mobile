// Router.js
import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';

// Import screens
import HomeScreen from '../Screen/HomeScreen';
import LoginScreen from '../Screen/LoginScreen';
import RegisterScreen from '../Screen/RegisterScreen';
import DetailScreen from '../Screen/DetailScreen';
import CategoryScreen from '../Screen/CategoryScreen';
import CommentScreen from '../Screen/MyorderScreen';
import CartScreen from '../Screen/CartScreen';
import ProfileScreen from '../Screen/ProfileScreen';
import AboutmeScreen from '../Screen/AboutmeScreen';
import PolicyStack from '../Screen/PolicyScreen/PolicyRoutes';
import EditProfileScreen from '../Screen/EditProfile';
import CheckoutScreen from '../Screen/CheckoutScreen';
import AdminPanelScreen from '../Screen/AdminPanelScreen';
import Adminpage from '../Screen/Adminpage';
import Adminorder from '../Screen/Adminorder';
import Adminacc from '../Screen/Adminacc';
import MyorderScreen from '../Screen/MyorderScreen';

const Stack = createNativeStackNavigator();

// ---------------- Tab Icons ----------------
const getTabBarIcon = (route, focused, size) => {
  let iconName;
  if (route.name === 'Trang Chủ') iconName = 'home';
  else if (route.name === 'Thực Đơn') iconName = 'fast-food-sharp';
  else if (route.name === 'Thêm') iconName = 'menu';
  else if (route.name === 'Giỏ Hàng') iconName = 'cart-outline';
  else if (route.name === 'Thêm') iconName = 'menu';
  return <Ionicons name={iconName} size={size} color={focused ? 'red' : '#999'} />;
};

// ---------------- Home Stack ----------------
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="CategoryScreen" component={CategoryScreen} />
      <HomeStack.Screen name="DetailScreen" component={DetailScreen} options={{ title: 'Món ngon của bạn', headerShown:true }} />
      <HomeStack.Screen name="CartScreen" component={CartScreen} />
      <HomeStack.Screen name="AboutmeScreen" component={AboutmeScreen} />
    </HomeStack.Navigator>
  );
}

// ---------------- Main Tabs ----------------
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => getTabBarIcon(route, focused, size),
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Trang Chủ" component={HomeStackScreen} />
      <Tab.Screen name="Thực Đơn" component={CategoryScreen} />
      <Tab.Screen name="Giỏ Hàng" component={CartScreen} />
      <Tab.Screen name="Thêm" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ---------------- Root Stack ----------------
const RootStack = createNativeStackNavigator();

export default function AppRouter() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {/* Main Tabs */}
        <RootStack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        {/* Screens tách ra ngoài Tab → Bottom Tab sẽ ẩn */}
        
        <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: true }} />
        <RootStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true }} />
        <RootStack.Screen name="CommentScreen" component={CommentScreen} options={{ title: 'Viết bình luận' }} />
        <RootStack.Screen name="PolicyStack" component={PolicyStack} options={{ headerShown: false }}/>
        <RootStack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true }} />
        <RootStack.Screen name ="CheckoutScreen" component={CheckoutScreen} options={{ headerShown: true }} />
        <RootStack.Screen name="AdminPanel" component={AdminPanelScreen} options={{ headerShown: true }} />
        <RootStack.Screen name="Adminpage" component={Adminpage} options={{ headerShown: true }} />
        <RootStack.Screen name="Adminorder" component={Adminorder} options={{ headerShown: true }} />
        <RootStack.Screen name="Adminacc" component={Adminacc} options={{ headerShown: true }} />
        <RootStack.Screen name="MyorderScreen" component={MyorderScreen} options={{ headerShown: true }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
