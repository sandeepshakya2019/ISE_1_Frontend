import React from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

// Using React Native's built-in components for Card and Button instead
const Card = ({children, style}) => (
  <View style={[styles.card, style]}>{children}</View>
);

const Button = ({onPress, children, style}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{children}</Text>
  </TouchableOpacity>
);

const PaymentGatewayScreen = ({route, navigation}) => {
  const {repaymentAmount} = route.params;

  const handleGooglePay = () => {
    Alert.alert('Redirecting to Google Pay');
  };

  const handleCardPayment = () => {
    Alert.alert('Proceeding to Card Payment');
  };

  const handleQRCodePayment = () => {
    Alert.alert('Displaying QR Code');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Payment Method</Text>
      <Text style={styles.amount}>Repayment Amount: ₹{repaymentAmount}</Text>

      {/* QR Code Payment Option */}
      <Card style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={handleQRCodePayment}>
          <Image
            source={{uri: 'https://dummyimage.com/100x100/000/fff&text=QR'}}
            style={styles.image}
          />
          <Text style={styles.optionText}>Pay with QR Code</Text>
        </TouchableOpacity>
      </Card>

      {/* Card Payment Option */}
      <Card style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={handleCardPayment}>
          <Image
            source={{uri: 'https://dummyimage.com/100x100/000/fff&text=Card'}}
            style={styles.image}
          />
          <Text style={styles.optionText}>Pay with Card</Text>
        </TouchableOpacity>
      </Card>

      {/* Google Pay Payment Option */}
      <Card style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={handleGooglePay}>
          <Image
            source={{uri: 'https://dummyimage.com/100x100/000/fff&text=GPay'}}
            style={styles.image}
          />
          <Text style={styles.optionText}>Pay with Google Pay</Text>
        </TouchableOpacity>
      </Card>

      {/* Go Back Button */}
      <Button onPress={() => navigation.goBack()} style={styles.goBackButton}>
        Go Back
      </Button>
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
  amount: {fontSize: 18, marginBottom: 20, color: '#555'},
  card: {
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
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  cardContainer: {
    width: '90%',
    marginVertical: 10,
  },
  goBackButton: {
    marginTop: 20,
    width: '90%',
  },
});

export default PaymentGatewayScreen;
