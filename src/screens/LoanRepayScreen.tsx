import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const LoanRepayScreen = () => {
  const [amount, setAmount] = useState('');

  const handleRepay = () => {
    if (amount) {
      alert('Loan Repayment Submitted');
    } else {
      alert('Please enter repayment amount.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repay Loan</Text>
      <TextInput placeholder="Repayment Amount" style={styles.input} value={amount} onChangeText={setAmount} />
      <Button title="Submit" onPress={handleRepay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginVertical: 10 },
});

export default LoanRepayScreen;
