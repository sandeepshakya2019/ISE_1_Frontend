import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ScrollView,
  Alert,
  BackHandler,
  ActivityIndicator,
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
        Alert.alert(
          'Error',
          'Failed to fetch profile details. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const handleBackPress = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Yes', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    Alert.alert('Logout', 'You have been logged out.');
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
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
      <ProfileDetail label="Name" value={userdetails.fullName} />
      <ProfileDetail label="Mobile" value={userdetails.mobileNo} />
      <ProfileDetail label="Email" value={userdetails.emailId} />
      <ProfileDetail label="No. of Loans" value={userdetails.noOfLoan} />
      <ProfileDetail
        label="Sectioned Amount"
        value={userdetails.sectionedAmount}
      />
      <ProfileDetail label="Offered Amount" value={userdetails.offeredAmount} />

      <Section title="Loan Details" data={loandetails} renderItem={LoanItem} />
      <Section title="KYC Details" data={kycDetaiils} renderItem={KycItem} />

      <View style={styles.buttonContainer}>
        <Button
          title="Go to Loan Details"
          onPress={() => navigation.navigate('LoanDetails')}
          color="#00796b"
        />
        <Button title="Logout" onPress={handleLogout} color="#d9534f" />
      </View>
    </ScrollView>
  );
};

const ProfileDetail = ({label, value}) => (
  <Text style={styles.info}>
    {label}: {value}
  </Text>
);

const Section = ({title, data, renderItem}) => (
  <View>
    <Text style={styles.subheading}>{title}</Text>
    {data?.length > 0 ? data.map(renderItem) : <Text>No {title} Found</Text>}
  </View>
);

const LoanItem = (loan, index) => (
  <View key={index} style={styles.loanContainer}>
    <Text>Total Loan Amount: {loan.totalLoanAmount}</Text>
    <Text>Reason: {loan.loanReason}</Text>
    <Text>Status: {loan.loanStatus}</Text>
    <Text>Remaining Amount: {loan.leftAmount}</Text>
  </View>
);

const KycItem = (kyc, index) => (
  <View key={index} style={styles.kycContainer}>
    <Text>Aadhar ID: {kyc.aadharCardId}</Text>
    <Text>Account Number: {kyc.accountNumber}</Text>
    <Text>IFSC Code: {kyc.ifscCode}</Text>
    <Text>Address: {kyc.address}</Text>
    {kyc.photo && <Image source={{uri: kyc.photo}} style={styles.kycImage} />}
  </View>
);

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
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
});

export default ProfileScreen;
