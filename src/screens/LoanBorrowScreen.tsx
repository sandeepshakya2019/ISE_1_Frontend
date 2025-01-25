import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {api} from '../utils/api';

const LoanBorrowScreen = () => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleBorrow = async () => {
    if (!amount || !reason) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all fields.',
      });
      return;
    }

    try {
      setLoading(true);

      // Get the authentication token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Error',
          text2: 'Token not found. Please log in again.',
        });
        return;
      }

      // Prepare the request payload
      const payload = {
        totalLoanAmount: parseFloat(amount), // Convert the amount to a number
        loanReason: reason,
      };

      // Send the API request
      const response = await api.post('/loan/access', payload, {
        headers: {Authorization: `Bearer ${token}`},
      });

      // Handle success response
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2:
          response?.data?.message || 'Loan request submitted successfully!',
      });

      // Navigate back to the Loan Details page
      navigation.navigate('LoanDetails');
    } catch (error: any) {
      console.error(
        'Error submitting loan request:',
        error.response.data.message.userError,
      );
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          error?.response?.data?.message?.userError ||
          'Failed to submit loan request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Toast />
      <Text style={styles.title}>Borrow Loan</Text>
      <TextInput
        placeholder="Amount"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Reason"
        style={styles.input}
        value={reason}
        onChangeText={setReason}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#28a745" />
      ) : (
        <Button title="Submit" onPress={handleBorrow} />
      )}
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
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});

export default LoanBorrowScreen;
