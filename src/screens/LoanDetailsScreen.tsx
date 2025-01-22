import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const LoanDetailsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loan Details</Text>
      <Text style={styles.info}>Total Loan Amount: $10,000</Text>
      <Text style={styles.info}>Eligible Loan Amount: $5,000</Text>
      <Button title="Borrow Loan" onPress={() => navigation.navigate('LoanBorrow')} />
      <Button title="Repay Loan" onPress={() => navigation.navigate('LoanRepay')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  info: { fontSize: 18, marginVertical: 10 },
});

export default LoanDetailsScreen;
