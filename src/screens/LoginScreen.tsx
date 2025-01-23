import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Logo from '../components/Shared/Logo';

const LoginScreen = ({navigation}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const handleGetOTP = () => {
    if (mobileNumber && email && isTermsAccepted) {
      navigation.navigate('OTP');
    } else {
      alert('Please fill in all fields and accept terms and conditions.');
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.headingText}>Register</Text>
      <TextInput
        placeholder="Mobile Number"
        style={styles.input}
        keyboardType="numeric"
        value={mobileNumber}
        onChangeText={setMobileNumber}
      />
      <TextInput
        placeholder="Email ID"
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
    </View>
  );
};

const styles = StyleSheet.create({
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff', // White background
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
});

export default LoginScreen;
