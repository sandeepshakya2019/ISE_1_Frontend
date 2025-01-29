import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiCallWithHeader} from '../utils/api';

const ProfileScreen = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [success, response] = await apiCallWithHeader('/profile', 'GET');
        if (success && response?.message?.userdetails) {
          setUserData(response.message);
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert(
          'Error',
          'Failed to fetch profile details. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    Alert.alert('Logout', 'You have been logged out.');
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading user details...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No user data available.</Text>
      </View>
    );
  }

  const {userdetails, loandetails, kycDetaiils} = userData;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      {userdetails.photo && (
        <Image source={{uri: userdetails.photo}} style={styles.profileImage} />
      )}
      <Text style={styles.info}>Name: {userdetails.fullName}</Text>
      <Text style={styles.info}>Mobile: {userdetails.mobileNo}</Text>
      <Text style={styles.info}>Email: {userdetails.emailId}</Text>
      <Text style={styles.info}>No. of Loans: {userdetails.noOfLoan}</Text>
      <Text style={styles.info}>
        Sectioned Amount: {userdetails.sectionedAmount}
      </Text>
      <Text style={styles.info}>
        Offered Amount: {userdetails.offeredAmount}
      </Text>

      <Text style={styles.subheading}>Loan Details</Text>
      {loandetails?.length > 0 ? (
        loandetails?.map((loan, index) => (
          <View key={index} style={styles.loanContainer}>
            <Text>Total Loan Amount: {loan.totalLoanAmount}</Text>
            <Text>Reason: {loan.loanReason}</Text>
            <Text>Status: {loan.loanStatus}</Text>
            <Text>Remaining Amount: {loan.leftAmount}</Text>
          </View>
        ))
      ) : (
        <Text>No Loans Found</Text>
      )}

      <Text style={styles.subheading}>KYC Details</Text>
      {kycDetaiils?.length > 0 ? (
        kycDetaiils?.map((kyc, index) => (
          <View key={index} style={styles.kycContainer}>
            <Text>Aadhar ID: {kyc.aadharCardId}</Text>
            <Text>Account Number: {kyc.accountNumber}</Text>
            <Text>IFSC Code: {kyc.ifscCode}</Text>
            <Text>Address: {kyc.address}</Text>
            {kyc.photo && (
              <Image source={{uri: kyc.photo}} style={styles.kycImage} />
            )}
          </View>
        ))
      ) : (
        <Text>No KYC Details Found</Text>
      )}

      <Button
        title="Go to Loan Details"
        onPress={() => navigation.navigate('LoanDetails')}
      />
      <Button title="Logout" onPress={handleLogout} color="#d9534f" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  loanContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  kycContainer: {
    backgroundColor: '#eef2f3',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  kycImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
