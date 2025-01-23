import React, { useState } from 'react';
import {
  View,
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
import { launchCamera } from 'react-native-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  LoanDetails: { photo: string | null }; // Expecting a photo param
};

type KYCScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoanDetails'>;

type Props = {
  navigation: KYCScreenNavigationProp;
};

const KYCScreen: React.FC<Props> = ({ navigation }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [incomeCertificate, setIncomeCertificate] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [errors, setErrors] = useState({
    fullName: false,
    address: false,
    aadhar: false,
    incomeCertificate: false,
    bankAccount: false,
    ifsc: false,
    photo: false,
  });

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
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS permissions are handled differently and should already be configured in Info.plist
    }
  };

  const capturePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      alert('Camera permission is required to capture photos.');
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
        alert('No photo captured.');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      alert('An error occurred while capturing the photo.');
    }
  };

  const handleSubmit = () => {
    const validationErrors = {
      fullName: !fullName,
      address: !address,
      aadhar: !aadhar,
      incomeCertificate: !incomeCertificate,
      bankAccount: !bankAccount,
      ifsc: !ifsc,
      photo: !photo,
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).includes(true)) {
      alert('Please fill all required fields and capture a photo.');
    } else {
      // Navigate to LoanDetailsScreen with the photo
      navigation.navigate('LoanDetails', { photo });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KYC Details</Text>
      <TextInput
        placeholder="Full Name"
        style={[styles.input, errors.fullName && styles.errorInput]}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        placeholder="Address"
        style={[styles.input, errors.address && styles.errorInput]}
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        placeholder="Aadhar Details"
        style={[styles.input, errors.aadhar && styles.errorInput]}
        value={aadhar}
        onChangeText={setAadhar}
      />
      <TextInput placeholder="Ration Card No." style={styles.input} />
      <TextInput
        placeholder="Income Certificate No."
        style={[styles.input, errors.incomeCertificate && styles.errorInput]}
        value={incomeCertificate}
        onChangeText={setIncomeCertificate}
      />
      <TextInput
        placeholder="Bank Account No."
        style={[styles.input, errors.bankAccount && styles.errorInput]}
        value={bankAccount}
        onChangeText={setBankAccount}
      />
      <TextInput
        placeholder="IFSC Code"
        style={[styles.input, errors.ifsc && styles.errorInput]}
        value={ifsc}
        onChangeText={setIfsc}
      />

      <TouchableOpacity style={styles.photoButton} onPress={capturePhoto}>
        <Text style={styles.photoButtonText}>Capture Photo</Text>
      </TouchableOpacity>

      {photo && <Image source={{ uri: photo }} style={styles.photoPreview} />}
      {errors.photo && <Text style={styles.errorText}>Photo is required.</Text>}

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginVertical: 10 },
  errorInput: { borderColor: 'red' }, // Red border for error fields
  photoButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  photoButtonText: { color: '#fff', fontWeight: 'bold' },
  photoPreview: { width: '100%', height: 200, marginTop: 20, borderRadius: 5 },
  errorText: { color: 'red', fontSize: 14, marginTop: 5, textAlign: 'center' }, // Red error message for photo
});

export default KYCScreen;
