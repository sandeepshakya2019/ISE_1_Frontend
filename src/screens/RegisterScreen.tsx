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
import Toast from 'react-native-toast-message'; // Import Toast
import Logo from '../components/Shared/Logo';
import {api} from '../utils/api';
import toastConfig from '../styles/toastConfig';
// comment check
const RegisterScreen = ({navigation}) => {
  const [formData, setFormData] = useState({
    name: 'Sandeep',
    mobileNumber: '9084043946',
    email: 'sandeep@gmail.com',
    isTermsAccepted: false,
  });
  const [loading, setLoading] = useState(false); // Loading state

  const handleInputChange = (field, value) => {
    setFormData(prevState => ({...prevState, [field]: value}));
  };

  const validateForm = () => {
    const {name, mobileNumber, email, isTermsAccepted} = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      return 'Please enter your full name.';
    }

    if (!mobileNumber || mobileNumber.length !== 10) {
      return 'Please enter a valid 10-digit mobile number.';
    }

    if (email && !emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (!isTermsAccepted) {
      return 'You must accept the Terms and Conditions.';
    }

    return null;
  };

  const loginUser = async () => {
    try {
      const payload = {mobileNo: formData.mobileNumber};
      const response = await api.post('/users/login-otp', payload);
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Please check your mobile number.',
      });
      return response;
    } catch (error: any) {
      let errorMessage = 'Something went wrong. Please try again.';
      const errorData = error?.response?.data?.message;
      if (errorData && typeof errorData === 'string') {
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

  const getOTP = async () => {
    if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Enter a valid 10-digit mobile number.',
      });
      return;
    }
    setLoading(true);
    try {
      await loginUser();
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
    try {
      const {name, mobileNumber, email} = formData;
      const payload = {
        mobileNo: mobileNumber,
        fullName: name,
        emailId: email,
      };

      console.log('Register payload:', payload);

      const response = await api.post('/users/register', payload);

      return response;
    } catch (error: any) {
      console.error('Register Error:', error?.response?.data);

      let errorMessage = 'Something went wrong. Please try again.'; // Default message
      const errorData = error?.response?.data?.message;

      // Check if `errorData` is an object and find the first key with a non-empty value
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
        text1: 'Registration Failed',
        text2: errorMessage,
      });

      throw error;
    }
  };

  const handleGetOTP = async () => {
    const validationError = validateForm();
    if (validationError) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: validationError,
      });
      return;
    }

    setLoading(true); // Start loading
    try {
      await registerUser();
      await getOTP();
      navigation.replace('OTP', {
        fromLogin: false,
        mobileNo: formData.mobileNumber,
      });
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Please wait for the OTP.',
      });
    } catch (error) {
      console.error('Error during registration:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleAlreadyRegistered = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Toast config={toastConfig} />
      <Logo />

      <Text style={styles.logoText}>Register</Text>
      <TextInput
        placeholder="Name"
        style={styles.input}
        value={formData.name}
        onChangeText={text => handleInputChange('name', text)}
      />
      <TextInput
        placeholder="Mobile Number"
        style={styles.input}
        keyboardType="numeric"
        value={formData.mobileNumber}
        onChangeText={text =>
          handleInputChange(
            'mobileNumber',
            text.replace(/[^0-9]/g, '').slice(0, 10),
          )
        }
      />
      <TextInput
        placeholder="Email ID (optional)"
        style={styles.input}
        keyboardType="email-address"
        value={formData.email}
        onChangeText={text => handleInputChange('email', text)}
      />
      <TouchableOpacity
        onPress={() =>
          handleInputChange('isTermsAccepted', !formData.isTermsAccepted)
        }
        style={styles.checkboxContainer}>
        <Text style={styles.checkbox}>
          {formData.isTermsAccepted ? '☑' : '☐'} Accept Terms and Conditions
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" />
      ) : (
        <Button title="Get OTP" onPress={handleGetOTP} />
      )}

      <TouchableOpacity
        onPress={handleAlreadyRegistered}
        style={styles.linkButton}>
        <Text style={styles.linkText}>Already registered? Login here</Text>
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
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
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

export default RegisterScreen;
