import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const LoanBorrowScreen = () => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const handleBorrow = () => {
    if (amount && reason) {
      alert('Loan Borrow Request Submitted');
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Borrow Loan</Text>
      <TextInput placeholder="Amount" style={styles.input} value={amount} onChangeText={setAmount} />
      <TextInput placeholder="Reason" style={styles.input} value={reason} onChangeText={setReason} />
      <Button title="Submit" onPress={handleBorrow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginVertical: 10 },
});

export default LoanBorrowScreen;
