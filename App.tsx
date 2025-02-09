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
import DocumentScreen from './src/screens/DocumentScreen'; // Import DocumentScreen
import {apiCallWithHeader} from './src/utils/api';
import {logoutApiCall} from './src/utils/logout';
import GovtSchemeScreen from './src/screens/GovtSchemeScreen';

const Stack = createStackNavigator();

const CustomHeader = ({navigation, handleLogout}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false); // Loader state

  const handleLogoutPress = async () => {
    setLoadingLogout(true); // Show loader
    await handleLogout(); // Perform logout
    setLoadingLogout(false); // Hide loader
    setModalVisible(false); // Close modal
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

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
          {/* Show Loader when Logging Out */}
          {loadingLogout ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#28a745" />
              <Text style={styles.loaderText}>Logging out...</Text>
            </View>
          ) : (
            <>
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

              {/* New Document Screen in Modal */}
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  navigation.navigate('Document');
                  setModalVisible(false);
                }}>
                <Text style={styles.modalText}>Documents</Text>
              </TouchableOpacity>

              {/* New Document Screen in Modal */}
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  navigation.navigate('GovtSchemeScreen');
                  setModalVisible(false);
                }}>
                <Text style={styles.modalText}>Govt Schemes</Text>
              </TouchableOpacity>

              {/* Logout Button with Loader */}
              <TouchableOpacity
                style={styles.modalItem}
                onPress={handleLogoutPress}>
                <Text style={styles.modalText}>Logout</Text>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
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

  const handleLogout = async () => {
    // Call logout API
    await logoutApiCall();

    // Navigate to Login screen after logout
    setInitialRoute('Login');
  };

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
          headerShown: true, // Show header
          header: () => (
            <CustomHeader navigation={navigation} handleLogout={handleLogout} />
          ),
        })}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OTP"
          component={OTPScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="KYC" component={KYCScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="LoanDetails" component={LoanDetailsScreen} />
        <Stack.Screen name="LoanBorrow" component={LoanBorrowScreen} />
        <Stack.Screen name="LoanRepay" component={LoanRepayScreen} />
        <Stack.Screen name="PaymentGateway" component={PaymentGatewayScreen} />
        <Stack.Screen name="Document" component={DocumentScreen} />
        <Stack.Screen name="GovtSchemeScreen" component={GovtSchemeScreen} />
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
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 18,
    marginTop: 10,
    color: '#28a745',
  },
});

export default App;
