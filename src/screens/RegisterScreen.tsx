import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

const handleGetOTP = () => {
  if (mobileNumber && email && isTermsAccepted) {
    navigation.navigate('OTP', {fromLogin: false});
  } else {
    Alert.alert(
      'Validation Error',
      'Please fill in all fields and accept the terms and conditions.',
    );
  }
};


  const handleAlreadyRegistered = () => {
    navigation.navigate('Login'); // Navigate to Login screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Register</Text>
      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Mobile Number"
        style={styles.input}
        keyboardType="numeric"
        value={mobileNumber}
        onChangeText={setMobileNumber}
      />
      <TextInput
        placeholder="Email ID (optional)"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        onPress={() => setIsTermsAccepted(!isTermsAccepted)}
        style={styles.checkboxContainer}>
        <Text style={styles.checkbox}>
          {isTermsAccepted ? '☑' : '☐'} Accept Terms and Conditions
        </Text>
      </TouchableOpacity>
      <Button title="Get OTP" onPress={handleGetOTP} />
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

export default RegisterScreen;
