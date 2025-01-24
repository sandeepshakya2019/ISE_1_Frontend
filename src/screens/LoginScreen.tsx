import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Logo from '../components/Shared/Logo';
import {api} from '../utils/api';

const LoginScreen = ({navigation}) => {
  const [mobileNumber, setMobileNumber] = useState('9084043946');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginUser = async () => {
    try {
      const payload = {
        mobileNo: mobileNumber,
      };

      console.log('Login payload:', payload);

      const response = await api.post('/users/login-otp', payload);

      console.log('Login response:', response);

      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Please check your mobile number for the OTP.',
      });

      return response;
    } catch (error) {
      console.error('Login Error:', error?.response?.data);

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
        text1: 'Login Failed',
        text2: errorMessage,
      });

      throw error;
    }
  };

  const handleGetOTP = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid 10-digit mobile number.',
      });
      return;
    }

    if (!isTermsAccepted) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'You must accept the Terms and Conditions.',
      });
      return;
    }

    setLoading(true);
    try {
      await loginUser();
      // Replace the navigation stack to prevent going back to Login or Register
      navigation.replace('OTP', {fromLogin: true});
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNavigation = () => {
    navigation.navigate('Register');
  };

  const handleMobileNumberChange = text => {
    const formattedText = text.replace(/[^0-9]/g, '').slice(0, 10);
    setMobileNumber(formattedText);
  };

  return (
    <View style={styles.container}>
      <Toast />
      <Logo />
      <Text style={styles.logo}>Login</Text>
      <TextInput
        placeholder="Mobile Number"
        style={styles.input}
        keyboardType="numeric"
        value={mobileNumber}
        onChangeText={handleMobileNumberChange}
      />
      <TouchableOpacity
        onPress={() => setIsTermsAccepted(!isTermsAccepted)}
        style={styles.checkboxContainer}>
        <Text style={styles.checkbox}>
          {isTermsAccepted ? '☑' : '☐'} Accept Terms and Conditions
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" />
      ) : (
        <Button title="Get OTP" onPress={handleGetOTP} />
      )}

      <TouchableOpacity
        onPress={handleRegisterNavigation}
        style={styles.linkButton}>
        <Text style={styles.linkText}>
          Don't have an account? Register here
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  checkboxContainer: {flexDirection: 'row', marginVertical: 10},
  checkbox: {fontSize: 16, color: '#333'},
  linkButton: {marginTop: 20},
  linkText: {color: '#1E90FF', fontSize: 16, textDecorationLine: 'underline'},
});

export default LoginScreen;
