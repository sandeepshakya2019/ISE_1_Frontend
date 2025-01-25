import React, {useState, useEffect} from 'react';
import {
  View,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../utils/api';

const KYCScreen = ({navigation}) => {
  const [photo, setPhoto] = useState(null);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('Rani Awanti bai nagar...');
  const [aadhar, setAadhar] = useState('235689562356');
  const [bankAccount, setBankAccount] = useState('895623895623');
  const [ifsc, setIfsc] = useState('89562389562');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await api.get('/users/login-check', {
        headers: {Authorization: `Bearer ${token}`},
      });
      setFullName(response.data.message.fullName || '');
      setMobileNumber(response.data.message.mobileNo || '');
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch user details.');
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      return (
        (await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {title: 'Camera Permission', message: 'Need camera access.'},
        )) === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const handleCapture = async () => {
    const permission = await requestCameraPermission();
    if (!permission) {
      Alert.alert('Permission Denied', 'Camera access required.');
      return;
    }
    const result = await launchCamera({mediaType: 'photo', saveToPhotos: true});
    if (result.assets) setPhoto(result.assets[0].uri);
    else Alert.alert('Error', 'Photo not captured.');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('address', address);
      if (photo)
        formData.append('livePhoto', {
          uri: photo,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });

      await api.post('/users/kyc', formData, {
        headers: {Authorization: `Bearer token`},
      });
      navigation.replace('LoanDetails', {photo});
    } catch (error) {
      Alert.alert('Error', 'Submission Failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KYC Verification</Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        style={styles.input}
        editable={false}
      />
      <TextInput
        placeholder="Mobile Number"
        value={mobileNumber}
        style={styles.input}
        editable={false}
      />
      <TextInput
        placeholder="Address"
        value={address}
        style={[styles.input, styles.textArea]}
        onChangeText={setAddress}
        multiline
      />
      <TextInput
        placeholder="Aadhar Number"
        value={aadhar}
        style={styles.input}
        onChangeText={setAadhar}
        maxLength={12}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Bank Account Number"
        value={bankAccount}
        style={styles.input}
        onChangeText={setBankAccount}
      />
      <TextInput
        placeholder="IFSC Code"
        value={ifsc}
        style={styles.input}
        onChangeText={setIfsc}
      />

      <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
        {photo ? (
          <Image source={{uri: photo}} style={styles.photoPreview} />
        ) : (
          <Text style={styles.captureText}>📷 Capture Photo</Text>
        )}
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 20},
  title: {
    fontSize: 26, // Increased font size for the title
    fontWeight: '700', // Bold text
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Roboto', // If you want to use a specific font, you can add a custom one here
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontFamily: 'Arial', // You can change this to a custom font family here
    fontSize: 16, // Larger text inside the input fields
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    fontSize: 16, // Adjust the font size in textarea
    fontFamily: 'Arial', // Font family applied to textarea
  },
  errorInput: {borderColor: 'red'},
  photoButton: {
    backgroundColor: '#1DA1F2', // Twitter blue color
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    fontFamily: 'Roboto', // Set font family for the button text
  },
  photoButtonText: {
    color: '#fff', // Text color in button
    fontWeight: '600', // Semi-bold text in the button
    fontSize: 18, // Slightly larger button text size
    fontFamily: 'Roboto', // Custom font family, you can change to a different one
  },
  photoPreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'left',
    fontFamily: 'Arial', // Font family for error messages
  },
});

export default KYCScreen;
