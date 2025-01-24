import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';
import KYCScreen from './src/screens/KYCScreen';
import LoanDetailsScreen from './src/screens/LoanDetailsScreen';
import LoanBorrowScreen from './src/screens/LoanBorrowScreen';
import LoanRepayScreen from './src/screens/LoanRepayScreen';
import PaymentGatewayScreen from './src/screens/PaymentGatewayScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import {View, Text} from 'react-native';

const Stack = createStackNavigator();

// comment

const App = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const determineInitialRoute = async () => {
      try {
        // Check if the user is already registered
        const isRegistered = await AsyncStorage.getItem('isRegistered');
        if (isRegistered === 'true') {
          setInitialRoute('Login'); // Start with LoginScreen for registered users
        } else {
          setInitialRoute('Register'); // Start with RegisterScreen for new users
        }
      } catch (error) {
        console.error('Error determining initial route:', error);
      }
    };

    determineInitialRoute();
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
          options={{headerShown: true, title: 'Register'}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OTP"
          component={OTPScreen}
          options={{headerShown: true, title: 'Enter OTP'}}
        />
        <Stack.Screen
          name="KYC"
          component={KYCScreen}
          options={{headerShown: true, title: 'KYC Details'}}
        />
        <Stack.Screen
          name="LoanDetails"
          component={LoanDetailsScreen}
          options={{headerShown: true, title: 'Loan Details'}}
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
