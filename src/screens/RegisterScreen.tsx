import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
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
      <Text style={styles.logo}>Register</Text>
      <TextInput
        placeholder="Enter Full Name"
        style={styles.input}
        value={formData.name}
        onChangeText={text => handleInputChange('name', text)}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Enter Mobile Number"
        style={styles.input}
        keyboardType="numeric"
        value={formData.mobileNumber}
        onChangeText={text =>
          handleInputChange(
            'mobileNumber',
            text.replace(/[^0-9]/g, '').slice(0, 10),
          )
        }
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Email ID (optional)"
        style={styles.input}
        keyboardType="email-address"
        value={formData.email}
        onChangeText={text => handleInputChange('email', text)}
        placeholderTextColor="#888"
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
        <TouchableOpacity style={styles.button} onPress={handleGetOTP}>
          <Text style={styles.buttonText}>Get OTP</Text>
        </TouchableOpacity>
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
    backgroundColor: '#F4F7FC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 0,
    borderRadius: 30,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  checkbox: {
    fontSize: 16,
    color: '#444',
  },
  button: {
    width: '100%',
    backgroundColor: '#1E90FF',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#1E90FF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
