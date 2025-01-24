import React, {useState, useEffect} from 'react';
import {
  View,
  Alert,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';
import {api} from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  LoanDetails: {photo: string | null}; // Expecting a photo param
};

type KYCScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoanDetails'
>;

type Props = {
  navigation: KYCScreenNavigationProp;
};

const KYCScreen: React.FC<Props> = ({navigation}) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [f, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [incomeCertificate, setIncomeCertificate] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [errors, setErrors] = useState({
    fullName: false,
    mobileNumber: false,
    address: false,
    aadhar: false,
    incomeCertificate: false,
    bankAccount: false,
    ifsc: false,
    photo: false,
  });

  useEffect(() => {
    // Fetch user details from the API
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await api.get('/users/login-check', {
          headers: {Authorization: `Bearer ${token}`},
        });
        console.log('User details:', response.data.message);
        if (response && response.data && response.data.message) {
          const {fullName, mobileNo} = response.data.message;
          setFullName(fullName || '');
          setMobileNumber(mobileNo || '');
        }
      } catch (error: any) {
        console.error('Error fetching user details:', error);
        Alert.alert(
          'Error',
          'Unable to fetch user details. Please try again later.',
        );
      }
    };

    fetchUserDetails();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to capture photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const capturePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Error', 'Camera permission is required to capture photos.');
      return;
    }

    try {
      const result = await launchCamera({
        mediaType: 'photo',
        saveToPhotos: true,
      });
      if (result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri || null);
      } else {
        Alert.alert('Error', 'No photo captured.');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'An error occurred while capturing the photo.');
    }
  };

  const handleSubmit = async () => {
    const validationErrors = {
      fullName: !f,
      mobileNumber: mobileNumber.length !== 10,
      address: !address,
      aadhar: aadhar.length !== 12,
      incomeCertificate: !incomeCertificate,
      bankAccount: !bankAccount,
      ifsc: !ifsc,
      photo: !photo,
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).includes(true)) {
      Alert.alert(
        'Error',
        'Please fill all required fields and capture a photo.',
      );
      return;
    }

    try {
      // Construct payload
      const payload = {
        f,
        mobileNumber,
        address,
        aadhar,
        incomeCertificate,
        bankAccount,
        ifsc,
        photo, // Assuming the photo URI is accepted by the backend
      };

      // Simulating API request (Replace with actual API call)
      const response = await axios.post('/users/kyc', payload);

      if (response?.data?.success) {
        Alert.alert(
          'Success',
          'Your KYC details have been submitted successfully.',
        );
        navigation.replace('LoanDetails', {photo});
      }
    } catch (error: any) {
      console.error('KYC Submission Error:', error?.response?.data);
      const errorMessage =
        error?.response?.data?.message ||
        'Something went wrong. Please try again.';

      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KYC Details</Text>
      <TextInput
        placeholder="Full Name"
        style={[styles.input, errors.fullName && styles.errorInput]}
        value={f}
        onChangeText={setFullName}
        editable={false}
      />
      {errors.fullName && <Text style={styles.errorText}>*Required</Text>}

      <TextInput
        placeholder="Mobile Number"
        style={[styles.input, errors.mobileNumber && styles.errorInput]}
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="numeric"
        maxLength={10}
        editable={false}
      />
      {errors.mobileNumber && (
        <Text style={styles.errorText}>*Must be 10 digits</Text>
      )}

      <TextInput
        placeholder="Address"
        style={[
          styles.input,
          styles.textArea,
          errors.address && styles.errorInput,
        ]}
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={4}
      />
      {errors.address && <Text style={styles.errorText}>*Required</Text>}

      <TextInput
        placeholder="Aadhar Details"
        style={[styles.input, errors.aadhar && styles.errorInput]}
        value={aadhar}
        onChangeText={setAadhar}
        keyboardType="numeric"
        maxLength={12}
      />
      {errors.aadhar && (
        <Text style={styles.errorText}>*Must be 12 digits</Text>
      )}

      <TextInput
        placeholder="Income Certificate No."
        style={[styles.input, errors.incomeCertificate && styles.errorInput]}
        value={incomeCertificate}
        onChangeText={setIncomeCertificate}
      />
      {errors.incomeCertificate && (
        <Text style={styles.errorText}>*Required</Text>
      )}

      <TextInput
        placeholder="Bank Account No."
        style={[styles.input, errors.bankAccount && styles.errorInput]}
        value={bankAccount}
        onChangeText={setBankAccount}
      />
      {errors.bankAccount && <Text style={styles.errorText}>*Required</Text>}

      <TextInput
        placeholder="IFSC Code"
        style={[styles.input, errors.ifsc && styles.errorInput]}
        value={ifsc}
        onChangeText={setIfsc}
      />
      {errors.ifsc && <Text style={styles.errorText}>*Required</Text>}

      <TouchableOpacity style={styles.photoButton} onPress={capturePhoto}>
        <Text style={styles.photoButtonText}>📸 Capture Photo</Text>
      </TouchableOpacity>
      {photo && <Image source={{uri: photo}} style={styles.photoPreview} />}
      {errors.photo && <Text style={styles.errorText}>*Photo is required</Text>}

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 20},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorInput: {borderColor: 'red'},
  photoButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  photoButtonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  photoPreview: {width: '100%', height: 200, marginTop: 20, borderRadius: 5},
  errorText: {color: 'red', fontSize: 14, marginTop: 5, textAlign: 'left'},
});

export default KYCScreen;
