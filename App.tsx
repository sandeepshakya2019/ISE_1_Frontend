import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from './src/utils/api'; // Assuming api is a utility for API requests

import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';
import KYCScreen from './src/screens/KYCScreen';
import LoanDetailsScreen from './src/screens/LoanDetailsScreen';
import LoanBorrowScreen from './src/screens/LoanBorrowScreen';
import LoanRepayScreen from './src/screens/LoanRepayScreen';
import PaymentGatewayScreen from './src/screens/PaymentGatewayScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      console.log('ss');
      try {
        const keys = await AsyncStorage.getAllKeys();
        console.log('All stored keys:', keys);
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          console.log('token', token);
          // Send token to the backend to validate the user and check KYC status
          const response = await api.get('/users/login-check', {
            headers: {Authorization: `Bearer ${token}`},
          });

          console.log('login response', response.data.message);

          if (response && response.data && response.data.message) {
            const {isKYC, _id} = response.data.message;

            if (!_id) {
              // No user found, go to Login or Register
              setInitialRoute('Login');
            } else {
              // User exists, navigate based on KYC status
              if (!isKYC) {
                setInitialRoute('KYC'); // Navigate to KYC page if KYC is pending
              } else {
                setInitialRoute('LoanDetails'); // Navigate to LoanDetails if KYC is complete
              }
            }
          }
        } else {
          // If no token, show Login or Register screen
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('Error checking user authentication:', error);
        setInitialRoute('Login'); // In case of error, fallback to Login
      }
    };

    checkUserAuthentication();
  }, []);

  if (initialRoute === null) {
    // Render a loading screen while determining the initial route
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false, title: 'Register'}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OTP"
          component={OTPScreen}
          options={{headerShown: false, title: 'Enter OTP'}}
        />
        <Stack.Screen
          name="KYC"
          component={KYCScreen}
          options={{headerShown: false, title: 'KYC Details'}}
        />
        <Stack.Screen
          name="LoanDetails"
          component={LoanDetailsScreen}
          options={{headerShown: false, title: 'Loan Details'}}
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
          options={{title: 'Payment Gateway'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
