import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, StyleSheet, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {apiCallWithHeader} from './src/utils/api'; // Assuming api is a utility for API requests

import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';
import KYCScreen from './src/screens/KYCScreen';
import LoanDetailsScreen from './src/screens/LoanDetailsScreen';
import LoanBorrowScreen from './src/screens/LoanBorrowScreen';
import LoanRepayScreen from './src/screens/LoanRepayScreen';
import PaymentGatewayScreen from './src/screens/PaymentGatewayScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState<string>('Home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const response = await apiCallWithHeader('/users/login-check', 'GET');

        if (response[0] && response[1]?.message) {
          const {isKYC} = response[1]?.message;

          if (!isKYC) {
            Alert.alert(
              'KYC Required',
              'Please fill the KYC Details to proceed.',
            );
            setInitialRoute('KYC');
          } else {
            setInitialRoute('Profile');
          }
        } else {
          setInitialRoute('Register');
        }
      } catch (error: any) {
        console.log('Main Api Error', error);
        Alert.alert(
          'Authentication Error',
          'Something Went Wrong. Please Try Again...',
        );
        setInitialRoute('Register');
      } finally {
        setLoading(false);
      }
    };

    checkUserAuthentication();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false, title: 'Home', gestureEnabled: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerShown: false,
            title: 'Register',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false, title: 'Login', gestureEnabled: false}}
        />
        <Stack.Screen
          name="OTP"
          component={OTPScreen}
          options={{
            headerShown: false,
            title: 'Enter OTP',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="KYC"
          component={KYCScreen}
          options={{
            headerShown: false,
            title: 'KYC Details',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{headerShown: true, title: 'Profile'}}
        />
        <Stack.Screen
          name="LoanDetails"
          component={LoanDetailsScreen}
          options={{
            headerShown: false,
            title: 'Loan Details',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="LoanBorrow"
          component={LoanBorrowScreen}
          options={{headerShown: true, title: 'Borrow Loan'}}
        />
        <Stack.Screen
          name="LoanRepay"
          component={LoanRepayScreen}
          options={{headerShown: true, title: 'Repay Loan'}}
        />
        <Stack.Screen
          name="PaymentGateway"
          component={PaymentGatewayScreen}
          options={{headerShown: true, title: 'Payment Gateway'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
});

export default App;
