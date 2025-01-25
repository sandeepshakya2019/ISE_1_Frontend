import React, {useState} from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../utils/api';

const PaymentGatewayScreen = ({route, navigation}) => {
  const {loan} = route.params;
  const [loading, setLoading] = useState(false);

  const payment = async paymentMethod => {
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
        {
          loanId: loan._id,
          paymentMethod, // Pass the selected payment method
        },
        {headers: {Authorization: `Bearer ${token}`}},
      );

      if (response?.data?.success) {
        Alert.alert(
          'Payment Successful',
          `Loan ${loan._id} repaid successfully.`,
          [{text: 'OK'}],
          {cancelable: false},
        );

        // Navigate to Loan Details page after successful repayment
        navigation.navigate('LoanDetails');

        // Optionally, update loans list or other state as needed
      } else {
        throw new Error(response?.data?.message || 'Payment failed.');
      }
    } catch (error: any) {
      console.error('Error during payment:', error.response || error.message);
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2:
          error?.message || 'Failed to process the payment. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePay = () => {
    // Alert.alert('Processing', 'Redirecting to Google Pay...');
    payment('googlePay');
  };

  const handleCardPayment = () => {
    // Alert.alert('Processing', 'Proceeding to Card Payment...');
    payment('card');
  };

  const handleQRCodePayment = () => {
    // Alert.alert('Processing', 'Displaying QR Code...');
    payment('qrCode');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Payment Method</Text>
      <Text style={styles.amount}>
        Repayment Amount:{' '}
        <Text style={styles.amount}>₹ {loan?.totalLoanAmount}</Text>
      </Text>

      {/* QR Code Payment Option */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={handleQRCodePayment}
          disabled={loading}>
          <Image
            source={{uri: 'https://dummyimage.com/100x100/000/fff&text=QR'}}
            style={styles.image}
          />
          <Text style={styles.optionText}>Pay with QR Code</Text>
        </TouchableOpacity>
      </View>

      {/* Card Payment Option */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={handleCardPayment}
          disabled={loading}>
          <Image
            source={{uri: 'https://dummyimage.com/100x100/000/fff&text=Card'}}
            style={styles.image}
          />
          <Text style={styles.optionText}>Pay with Card</Text>
        </TouchableOpacity>
      </View>

      {/* Google Pay Payment Option */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={handleGooglePay}
          disabled={loading}>
          <Image
            source={{uri: 'https://dummyimage.com/100x100/000/fff&text=GPay'}}
            style={styles.image}
          />
          <Text style={styles.optionText}>Pay with Google Pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333'},
  amount: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff', // White text color for contrast
    backgroundColor: '#00796b', // Chip background color (you can adjust this)
    fontWeight: 'bold',
    paddingVertical: 8, // Vertical padding for chip height
    paddingHorizontal: 20, // Horizontal padding for chip width
    borderRadius: 25, // Rounded corners for the chip
    textAlign: 'center', // Center the text inside the chip
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2}, // Shadow offset for iOS
  },
  cardContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 10,
    width: '90%',
  },
  paymentOption: {flexDirection: 'row', alignItems: 'center', padding: 10},
  image: {width: 50, height: 50, marginRight: 15, borderRadius: 8},
  optionText: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  button: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '90%',
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
});

export default PaymentGatewayScreen;
