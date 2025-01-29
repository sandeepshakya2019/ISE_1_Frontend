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
      <Text style={styles.heading}>User Profile</Text>
      <View style={styles.profileSection}>
        <ProfileDetail label="Name" value={userdetails.fullName} />
        <ProfileDetail label="Mobile" value={userdetails.mobileNo} />
        <ProfileDetail label="Email" value={userdetails.emailId} />
        <ProfileDetail label="No. of Loans" value={userdetails.noOfLoan} />
        <ProfileDetail
          label="Sectioned Amount"
          value={userdetails.sectionedAmount}
        />
        <ProfileDetail
          label="Offered Amount"
          value={userdetails.offeredAmount}
        />
      </View>
      <Text style={styles.heading}>KYC Details</Text>
      <Section title="KYC Details" data={kycDetaiils} renderItem={KycItem} />
      <Text style={styles.heading}>Loan Details</Text>
      <Section title="Loan Details" data={loandetails} renderItem={LoanItem} />

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            title="Go to Loan Details"
            onPress={() => navigation.navigate('LoanDetails')}
            color="#00796b"
          />
        </View>
        <View style={styles.button}>
          <Button title="Logout" onPress={handleLogout} color="#d9534f" />
        </View>
      </View>
    </ScrollView>
  );
};

const ProfileDetail = ({label, value}) => (
  <Text style={styles.profile}>
    <Text style={styles.label}>{label}</Text>:{' '}
    <Text style={styles.info}>{value}</Text>
  </Text>
);

const Section = ({title, data, renderItem}) => (
  <View style={{width: '100%'}}>
    {data?.length > 0 ? data.map(renderItem) : <Text>No {title} Found</Text>}
  </View>
);

const LoanItem = (loan, index) => (
  <View key={index} style={styles.loanContainer}>
    <Text style={styles.profile}>
      <Text style={styles.label}>Total Loan Amount</Text> :
      <Text style={styles.info}> {loan.totalLoanAmount}</Text>
    </Text>
    <Text style={styles.profile}>
      <Text style={styles.label}>Reason</Text> :
      <Text style={styles.info}> {loan.loanReason}</Text>
    </Text>
    <Text style={styles.profile}>
      <Text style={styles.label}>Status</Text> :
      <Text style={styles.info}> {loan.loanStatus}</Text>
    </Text>
    <Text style={styles.profile}>
      <Text style={styles.label}>Remaining Amount</Text> :
      <Text style={styles.info}> {loan.leftAmount}</Text>
    </Text>
  </View>
);

const KycItem = (kyc, index) => (
  <View key={index} style={styles.kycContainer}>
    {kyc.photo && <Image source={{uri: kyc.photo}} style={styles.kycImage} />}
    <Text style={styles.profile}>
      <Text style={styles.label}>Aadhar ID</Text> :
      <Text style={styles.info}> {kyc.aadharCardId}</Text>
    </Text>
    <Text style={styles.profile}>
      <Text style={styles.label}>Account Number</Text> :
      <Text style={styles.info}> {kyc.accountNumber}</Text>
    </Text>
    <Text style={styles.profile}>
      <Text style={styles.label}>IFSC Code</Text> :
      <Text style={styles.info}> {kyc.ifscCode}</Text>
    </Text>
    <Text style={styles.profile}>
      <Text style={styles.label}>Address</Text> :
      <Text style={styles.info}> {kyc.address}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  button: {
    width: '45%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  profileSection: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  profile: {
    marginBottom: 5,
    width: '100%',
    textAlign: 'left',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'rgb(226, 225, 225)',
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  info: {
    fontSize: 16,
  },
  loanContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
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
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default ProfileScreen;
