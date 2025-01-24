import React from 'react';
import { Alert,View, Text, Button, StyleSheet } from 'react-native';

const PaymentGatewayScreen = ({ route, navigation }) => {
  const { repaymentAmount } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Payment Gateway</Text>
      <Text style={styles.amount}>Repayment Amount: ₹{repaymentAmount}</Text>

      <Button title="Pay with UPI" onPress={() => Alert.alert('UPI ID: upi@bank')} />
      <Button
        title="Pay with QR Code"
        onPress={() => Alert.alert('Show QR Code to Scan')}
      />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  amount: { fontSize: 18, marginBottom: 20 },
});

export default PaymentGatewayScreen;
