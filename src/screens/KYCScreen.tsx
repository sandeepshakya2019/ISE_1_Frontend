import React, {useState} from 'react';
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
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
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
      Alert.alert('Camera permission is required to capture photos.');
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
        Alert.alert('No photo captured.');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('An error occurred while capturing the photo.');
    }
  };

  const handleSubmit = () => {
    const validationErrors = {
      fullName: !fullName,
      address: !(street && city && state && postalCode),
      aadhar: aadhar.length !== 12,
      incomeCertificate: !incomeCertificate,
      bankAccount: !bankAccount,
      ifsc: !ifsc,
      photo: !photo,
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).includes(true)) {
      Alert.alert('Please fill all required fields and capture a photo.');
    } else {
      navigation.navigate('LoanDetails', {photo});
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
      {errors.fullName && <Text style={styles.errorText}>*Required</Text>}

      <Text style={styles.sectionTitle}>Address</Text>
      <TextInput
        placeholder="Street"
        style={[styles.input, errors.address && styles.errorInput]}
        value={street}
        onChangeText={setStreet}
      />
      <TextInput
        placeholder="City"
        style={[styles.input, errors.address && styles.errorInput]}
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        placeholder="State"
        style={[styles.input, errors.address && styles.errorInput]}
        value={state}
        onChangeText={setState}
      />
      <TextInput
        placeholder="Postal Code"
        style={[styles.input, errors.address && styles.errorInput]}
        value={postalCode}
        onChangeText={setPostalCode}
        keyboardType="numeric"
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
  sectionTitle: {fontSize: 18, fontWeight: 'bold', marginTop: 20},
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
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
