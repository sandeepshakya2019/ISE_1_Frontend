import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, StyleSheet, Alert} from 'react-native';
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
  const [initialRoute, setInitialRoute] = useState<string | null>('Login');
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const getAllKeys = await AsyncStorage.getAllKeys();
        console.log('Auth', getAllKeys);
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const response = await api.get('/users/login-check', {
            headers: {Authorization: `Bearer ${token}`},
          });
          setLoading(false);
          if (response && response.data && response.data.message) {
            const {isKYC, _id} = response.data.message;

            if (!_id) {
              setInitialRoute('Login');
            } else {
              if (!isKYC) {
                Alert.alert(
                  'KYC Required',
                  'Please fill in the KYC Details to proceed.',
                );
                setInitialRoute('KYC');
              } else {
                setInitialRoute('LoanDetails');
              }
            }
          }
        } else {
          Alert.alert('Session Expired', 'Please login again to continue.');
          setInitialRoute('Login');
        }
      } catch (error) {
        setLoading(false);

        console.error('Error checking user authentication:', error);

        // Show alert for error
        Alert.alert(
          'Authentication Error',
          'Unable to verify user. Please try again.',
        );

        setInitialRoute('Login'); // Fallback to Login
      } finally {
        setLoading(false); // Hide loading spinner after checking authentication
      }
    };

    checkUserAuthentication();
  }, []);

  if (loading) {
    // Render a loading screen while determining the initial route
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
          options={{
            headerShown: false,
            title: 'Login',
            gestureEnabled: false,
          }}
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
          options={{title: 'Payment Gateway'}}
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
    backgroundColor: '#f4f4f4', // Light background
  },
});

export default App;
