import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

const LoanDetailsScreen = ({ route, navigation }) => {
  const { photo } = route.params || {}; // Retrieve the photo URI passed from the KYC screen

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loan Details</Text>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.photo} />
      ) : (
        <Text style={styles.noPhotoText}>No photo available</Text>
      )}
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
  photo: { width: 150, height: 150, borderRadius: 75, marginBottom: 20 },
  noPhotoText: { fontSize: 16, color: '#777', marginBottom: 20 },
});

export default LoanDetailsScreen;
