import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../utils/api';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';

const LoanDetailsScreen = ({route}) => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loanDetails, setLoanDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingLoans, setFetchingLoans] = useState(false); // To show spinner for loan fetch
  const {photo} = route.params || {}; // Retrieve the photo URI passed from the KYC screen

  const navigation = useNavigation();

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Toast.show({
            text1: 'Error',
            text2: 'Authentication token not found. Please log in again.',
          });
          return;
        }

        const response = await api.get('/users/login-check', {
          headers: {Authorization: `Bearer ${token}`},
        });

        if (response?.data?.message) {
          setUserDetails(response.data.message); // Assuming the photo is in the 'message' field
        }
      } catch (error) {
        Toast.show({
          text1: 'Error',
          text2: 'Unable to fetch user details. Please try again later.',
        });
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      setFetchingLoans(true);
      try {
        // Retrieve the authentication token from AsyncStorage
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Toast.show({
            text1: 'Error',
            text2: 'Authentication token not found. Please log in again.',
          });
          return;
        }

        // Send the GET request to fetch loan details with Authorization header
        const response = await api.get('/loan/getAll', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token here
          },
        });

        // console.log('Loan details response:', response.data.message);
        if (response?.data?.message) {
          setLoanDetails(response.data.message);
          Toast.show({
            text1: 'Success',
            text2: 'Loan details fetched successfully.',
          });
        }
      } catch (error: any) {
        Toast.show({
          text1: 'Error',
          text2: 'Unable to fetch loan details. Please try again later.',
        });
        console.error('Error fetching loan details:', error.response);
      } finally {
        setFetchingLoans(false);
      }
    };

    fetchLoanDetails();
  }, []);

  const displayPhoto = photo || userDetails?.photo; // Fallback to user photo if available

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderLoanItem = ({item}) => {
    console.log(item);

    return (
      <View style={styles.loanItem}>
        <Text style={styles.loanText}>
          Loan Amount: ${item.totalLoanAmount}
        </Text>
        <Text style={styles.loanText}>Status: {item.loanStatus}</Text>
        <Text style={styles.loanText}>Reason: {item.loanReason}</Text>
        <Text style={styles.loanText}>
          Payback Amount: {item.paybackAmount}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loan Details</Text>

      {displayPhoto ? (
        <Image source={{uri: displayPhoto}} style={styles.photo} />
      ) : (
        <Text style={styles.noPhotoText}>No photo available</Text>
      )}

      <Text style={styles.info}>
        Total Loan Amount: {userDetails?.sectionedAmount || 'N/A'}
      </Text>
      <Text style={styles.info}>
        Eligible Loan Amount: {userDetails?.offeredAmount || 'N/A'}
      </Text>
      <Text style={styles.info}>
        Number of Loans: {userDetails?.noOfLoan || 0}
      </Text>

      {/* Borrow and Repay Loan buttons side by side */}
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            title="Borrow Loan"
            onPress={() => navigation.navigate('LoanBorrow')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Repay Loan"
            onPress={() => navigation.navigate('LoanRepay')}
          />
        </View>
      </View>

      {fetchingLoans ? (
        <ActivityIndicator size="large" color="#28a745" />
      ) : (
        <FlatList
          data={loanDetails}
          renderItem={renderLoanItem}
          keyExtractor={item => item._id.toString()}
          contentContainerStyle={styles.loanList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4', // Light background for the app
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  info: {
    fontSize: 18,
    marginVertical: 10,
    color: '#555',
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  noPhotoText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  loanItem: {
    width: '100%', // Take full width of the app
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#ffffff', // White background for loan items
    borderRadius: 10, // Rounded corners
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Add shadow for Android
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loanText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  loanTextHighlight: {
    fontWeight: 'bold',
    color: '#28a745', // Highlight color for important text
  },
  loanList: {
    width: '100%',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    width: '45%',
  },
});

export default LoanDetailsScreen;
