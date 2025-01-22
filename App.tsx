// /**
//  * Login Page App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React, {useState} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   useColorScheme,
//   Alert,
// } from 'react-native';

// import {Colors} from 'react-native/Libraries/NewAppScreen';

// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       Alert.alert('Error', 'Please enter a valid email address.');
//       return;
//     }

//     Alert.alert('Success', 'You are logged in!');
//     console.log('Email:', email);
//     console.log('Password:', password);
//   };

//   return (
//     <SafeAreaView style={[backgroundStyle, styles.safeArea]}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <View
//           style={[
//             styles.container,
//             {backgroundColor: isDarkMode ? Colors.black : Colors.white},
//           ]}>
//           <Text style={[styles.title, {color: isDarkMode ? Colors.white : Colors.black}]}>
//             Login
//           </Text>
//           <TextInput
//             style={[styles.input, {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter}]}
//             placeholder="Email"
//             placeholderTextColor={isDarkMode ? Colors.light : Colors.dark}
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//           <TextInput
//             style={[styles.input, {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter}]}
//             placeholder="Password"
//             placeholderTextColor={isDarkMode ? Colors.light : Colors.dark}
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />
//           <TouchableOpacity style={styles.button} onPress={handleLogin}>
//             <Text style={styles.buttonText}>Login</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     padding: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     fontSize: 16,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 8,
//     width: '100%',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default App;
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';
import KYCScreen from './src/screens/KYCScreen';
import LoanDetailsScreen from './src/screens/LoanDetailsScreen';
import LoanBorrowScreen from './src/screens/LoanBorrowScreen';
import LoanRepayScreen from './src/screens/LoanRepayScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTP"
          component={OTPScreen}
          options={{ headerShown: true, title: 'Enter OTP' }}
        />
        <Stack.Screen
          name="KYC"
          component={KYCScreen}
          options={{ headerShown: true, title: 'KYC Details' }}
        />
        <Stack.Screen
          name="LoanDetails"
          component={LoanDetailsScreen}
          options={{ headerShown: true, title: 'Loan Details' }}
        />
        <Stack.Screen
          name="LoanBorrow"
          component={LoanBorrowScreen}
          options={{ headerShown: true, title: 'Borrow Loan' }}
        />
        <Stack.Screen
          name="LoanRepay"
          component={LoanRepayScreen}
          options={{ headerShown: true, title: 'Repay Loan' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
