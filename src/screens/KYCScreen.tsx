import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const KYCScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KYC Details</Text>
      <TextInput placeholder="Full Name" style={styles.input} />
      <TextInput placeholder="Address" style={styles.input} />
      <TextInput placeholder="Aadhar Details" style={styles.input} />
      <TextInput placeholder="Ration Card No." style={styles.input} />
      <TextInput placeholder="Income Certificate No." style={styles.input} />
      <TextInput placeholder="Bank Account No., IFSC Code" style={styles.input} />
      <Button title="Submit" onPress={() => navigation.navigate('LoanDetails')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginVertical: 10 },
});

export default KYCScreen;
