import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {apiCallWithHeader} from './src/utils/api';

import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';
import KYCScreen from './src/screens/KYCScreen';
import LoanDetailsScreen from './src/screens/LoanDetailsScreen';
import LoanBorrowScreen from './src/screens/LoanBorrowScreen';
import LoanRepayScreen from './src/screens/LoanRepayScreen';
import PaymentGatewayScreen from './src/screens/PaymentGatewayScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

const CustomHeader = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.headerContainer}>
      {/* Breadcrumb Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.breadcrumbButton}>
        <Text style={styles.breadcrumbText}>☰</Text>
      </TouchableOpacity>

      {/* Navigation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              navigation.navigate('Profile');
              setModalVisible(false);
            }}>
            <Text style={styles.modalText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              navigation.navigate('LoanDetails');
              setModalVisible(false);
            }}>
            <Text style={styles.modalText}>Loan Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              navigation.navigate('LoanBorrow');
              setModalVisible(false);
            }}>
            <Text style={styles.modalText}>Borrow Loan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              navigation.navigate('LoanRepay');
              setModalVisible(false);
            }}>
            <Text style={styles.modalText}>Repay Loan</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              navigation.navigate('PaymentGateway');
              setModalVisible(false);
            }}>
            <Text style={styles.modalText}>Payment Gateway</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const App = () => {
  const [initialRoute, setInitialRoute] = useState('Home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const response = await apiCallWithHeader('/users/login-check', 'GET');

        if (response[0] && response[1]?.message) {
          const {isKYC} = response[1]?.message;

          if (!isKYC) {
            Alert.alert(
              'KYC Required',
              'Please fill the KYC Details to proceed.',
            );
            setInitialRoute('KYC');
          } else {
            setInitialRoute('Profile');
          }
        } else {
          setInitialRoute('Register');
        }
      } catch (error) {
        console.log('Main Api Error', error);
        Alert.alert(
          'Authentication Error',
          'Something Went Wrong. Please Try Again...',
        );
        setInitialRoute('Register');
      } finally {
        setLoading(false);
      }
    };

    checkUserAuthentication();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={({navigation}) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="KYC" component={KYCScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="LoanDetails" component={LoanDetailsScreen} />
        <Stack.Screen name="LoanBorrow" component={LoanBorrowScreen} />
        <Stack.Screen name="LoanRepay" component={LoanRepayScreen} />
        <Stack.Screen name="PaymentGateway" component={PaymentGatewayScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  headerContainer: {
    padding: 15,
    backgroundColor: '#28a745',
    alignItems: 'flex-start',
  },
  breadcrumbButton: {
    padding: 10,
  },
  breadcrumbText: {
    fontSize: 24,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#28a745',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
