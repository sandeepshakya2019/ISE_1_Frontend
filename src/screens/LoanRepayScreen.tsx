import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // Toast notifications
import {api} from '../utils/api'; // API utility

const LoanRepayScreen = ({navigation}) => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserDetailsAndLoans = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Toast.show({
            type: 'error',
            text1: 'Authentication Error',
            text2: 'Please log in to continue.',
          });
          navigation.replace('Login'); // Redirect to login if token is missing
          return;
        }

        const userResponse = await api.get('/users/login-check', {
          headers: {Authorization: `Bearer ${token}`},
        });

        if (userResponse?.data?.message) {
          setUserName(userResponse?.data?.message?.fullName);
        } else {
          throw new Error('Failed to fetch user details.');
        }

        const loansResponse = await api.get('/loan/getAll', {
          headers: {Authorization: `Bearer ${token}`},
        });

        if (loansResponse?.data?.message) {
          setLoans(loansResponse.data.message);
        } else {
          throw new Error('Failed to fetch loan details.');
        }
      } catch (error) {
        console.error('Error:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'An error occurred while fetching data.',
        });
        navigation.replace('Login'); // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetailsAndLoans();
  }, [navigation]);

  const handleRepay = async () => {
    if (!selectedLoan) {
      Toast.show({
        type: 'error',
        text1: 'No Loan Selected',
        text2: 'Please select a loan to repay.',
      });
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Error',
          text2: 'Please log in to continue.',
        });
        navigation.replace('Login');
        return;
      }

      const response = await api.post(
        '/loan/repay',
        {loanId: selectedLoan._id},
        {headers: {Authorization: `Bearer ${token}`}},
      );

      if (response?.data?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Loan ${selectedLoan._id} repaid successfully.`,
        });

        setLoans(loans.filter(loan => loan._id !== selectedLoan._id));
        setSelectedLoan(null);
        navigation.navigate('LoanDetails');
      } else {
        throw new Error(response?.data?.message || 'Repayment failed.');
      }
    } catch (error) {
      console.error('Error repaying loan:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Failed to repay the loan. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderLoanItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.loanItem,
        selectedLoan?._id === item._id && styles.selectedLoanItem,
      ]}
      onPress={() => setSelectedLoan(item)}>
      <Text style={styles.loanText}>Loan Amount: ${item.totalLoanAmount}</Text>
      <Text style={styles.loanText}>Status: {item.loanStatus}</Text>
      <Text style={styles.loanText}>Reason: {item.loanReason}</Text>
      <Text style={styles.loanText}>Payback Amount: {item.paybackAmount}</Text>
    </TouchableOpacity>
  );

  const filteredLoans = loans.filter(loan => loan.paybackAmount > 0);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#28a745" />
        </View>
      )}
      <Toast />
      <Text style={styles.title}>Repay Loan</Text>
      <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
      {filteredLoans.length > 0 ? (
        <FlatList
          data={filteredLoans}
          keyExtractor={item => item._id.toString()}
          renderItem={renderLoanItem}
          extraData={selectedLoan}
        />
      ) : (
        <Text style={styles.noLoansText}>
          No loans available for repayment.
        </Text>
      )}
      <Button
        title="Repay Selected Loan"
        onPress={handleRepay}
        disabled={!selectedLoan || loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  loanItem: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectedLoanItem: {
    borderColor: '#28a745',
    backgroundColor: '#e6f9ec',
  },
  loanText: {
    fontSize: 16,
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLoansText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default LoanRepayScreen;
