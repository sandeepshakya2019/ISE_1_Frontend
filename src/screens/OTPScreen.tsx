import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Logo from '../components/Shared/Logo';
import {api} from '../utils/api'; // Assuming you have an API utility file to handle requests
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const OTPScreen = ({navigation, route}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false); // Loading state to control the spinner
  const {fromLogin, mobileNo} = route.params || {}; // Get 'fromLogin' and 'mobileNo' from route.params

  useEffect(() => {
    if (fromLogin === undefined || mobileNo === undefined) {
      Alert.alert('Error', 'Navigation parameters missing.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.replace('Login');
          },
        },
      ]);
    }
  }, [fromLogin, mobileNo, navigation]);

  const handleInputChange = text => {
    if (/^\d{0,6}$/.test(text)) {
      setOtp(text);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length === 6) {
      try {
        setLoading(true); // Start loading spinner
        // API Request to verify OTP
        const payload = {otp, mobileNo}; // Include OTP and mobileNo in the payload
        const response = await api.post('/users/login-token', payload);
        console.log('Response otp', response?.data?.success);
        // Success Handling
        if (response && response.data && response?.data?.success) {
          // Store the token and mobile number in AsyncStorage
          await AsyncStorage.setItem(
            'authToken',
            response.data?.message?.refresht,
          ); // Assuming the token is in response.data.token
          await AsyncStorage.setItem(
            'mobileNo',
            response.data?.message?.user?.mobileNo,
          );
          Toast.show({
            type: 'success',
            text1: 'OTP Verified',
            text2: 'Your OTP has been successfully verified.',
          });

          const isKyc = response?.data?.message?.user?.isKYC;

          if (isKyc) {
            navigation.navigate('LoanDetails'); // Navigate to LoanDetailsScreen for Login flow
          } else {
            navigation.navigate('KYC'); // Navigate to KYC Screen for Register flow
          }
        }
      } catch (error: any) {
        let errorMessage = 'Something went wrong. Please try again.';
        const errorData = error?.response?.data?.message;

        if (errorData && typeof errorData === 'object') {
          const firstNonEmptyKey = Object.keys(errorData).find(
            key => errorData[key]?.trim() !== '',
          );
          errorMessage = firstNonEmptyKey
            ? errorData[firstNonEmptyKey]
            : errorMessage;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }

        Toast.show({
          type: 'error',
          text1: 'OTP Verification Failed',
          text2: errorMessage,
        });
      } finally {
        setLoading(false); // Stop loading spinner after request completes (success or failure)
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid 6-digit OTP.',
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true); // Start loading spinner
      // API Request to resend OTP
      const payload = {mobileNo}; // Only need the mobileNo to resend OTP
      const response = await api.post('/users/login-otp', payload);

      // Success Handling
      if (response && response.data) {
        Toast.show({
          type: 'success',
          text1: 'OTP Resent',
          text2: 'A new OTP has been sent to your mobile number.',
        });
        setOtp(''); // Clear OTP input field
      }
    } catch (error: any) {
      // Error Handling for Resend OTP
      console.error('Resend OTP Error:', error?.response?.data);

      let errorMessage = 'Something went wrong. Please try again.';
      const errorData = error?.response?.data?.message;

      if (errorData && typeof errorData === 'object') {
        const firstNonEmptyKey = Object.keys(errorData).find(
          key => errorData[key]?.trim() !== '',
        );
        errorMessage = firstNonEmptyKey
          ? errorData[firstNonEmptyKey]
          : errorMessage;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }

      Toast.show({
        type: 'error',
        text1: 'Resend OTP Failed',
        text2: errorMessage,
      });
    } finally {
      setLoading(false); // Stop loading spinner after request completes (success or failure)
    }
  };

  return (
    <View style={styles.container}>
      <Toast />
      <Logo />
      <Text style={styles.logo}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        value={otp}
        onChangeText={handleInputChange}
        keyboardType="numeric"
        maxLength={6}
        placeholder="Enter OTP"
        autoFocus
        textAlign="center"
      />

      {/* Loading spinner shown when API request is being made */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.spinner}
        />
      ) : (
        <>
          <Button title="Verify" onPress={handleVerifyOTP} />
          <Button title="Resend OTP" onPress={handleResendOTP} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 8, // This makes the OTP digits more spaced out
  },
  spinner: {
    marginVertical: 20,
  },
});

export default OTPScreen;
