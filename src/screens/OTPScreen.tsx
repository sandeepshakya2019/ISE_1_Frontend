import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const OTPScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = () => {
    if (otp) {
      navigation.navigate('KYC');
    } else {
      alert('Please enter OTP.');
    }
  };

  const handleResendOTP = () => {
    setOtp(''); // Clear the OTP input box
    alert('OTP Resent');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <TextInput
        placeholder="OTP"
        style={styles.input}
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <Button title="Verify" onPress={handleVerifyOTP} />
      <Button title="Resend OTP" onPress={handleResendOTP} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});

export default OTPScreen;

