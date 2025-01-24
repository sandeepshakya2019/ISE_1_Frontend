import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';

const OTPScreen = ({navigation, route}) => {
  const [otp, setOtp] = useState('');
  const {fromLogin} = route.params; // Get the fromLogin parameter

  useEffect(() => {
    if (fromLogin === undefined) {
      // Handle if the parameter is not passed
      Alert.alert('Error', 'Navigation parameter missing.');
    }
  }, [fromLogin]);

  const handleInputChange = (text: React.SetStateAction<string>) => {
    if (/^\d{0,6}$/.test(text)) {
      setOtp(text);
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      if (fromLogin) {
        navigation.navigate('LoanDetails'); // Navigate to LoanDetailsScreen for Login flow
      } else {
        navigation.navigate('KYC'); // Navigate to KYC Screen for Register flow
      }
    } else {
      Alert.alert('Validation Error', 'Please enter a valid 6-digit OTP.');
    }
  };

  const handleResendOTP = () => {
    setOtp('');
    Alert.alert('OTP Resent');
  };

  const otpDisplay = otp.padEnd(6, '_').split('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <View style={styles.otpContainer}>
        {otpDisplay.map((char, index) => (
          <Text key={index} style={styles.otpDigit}>
            {char}
          </Text>
        ))}
      </View>
      <TextInput
        style={styles.input}
        value={otp}
        onChangeText={handleInputChange}
        keyboardType="numeric"
        maxLength={6}
        placeholder="Enter OTP"
        autoFocus
      />
      <Button title="Verify" onPress={handleVerifyOTP} />
      <Button title="Resend OTP" onPress={handleResendOTP} />
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
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpDigit: {
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: 8,
    width: 40,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: '#ccc',
    color: '#333',
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
  },
});

export default OTPScreen;
