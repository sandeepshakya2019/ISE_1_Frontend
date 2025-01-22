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
  LoanDetails: undefined;
};

type KYCScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoanDetails'>;

type Props = {
  navigation: KYCScreenNavigationProp;
};

const KYCScreen: React.FC<Props> = ({ navigation }) => {
  const [photo, setPhoto] = useState<string | null>(null);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KYC Details</Text>
      <TextInput placeholder="Full Name" style={styles.input} />
      <TextInput placeholder="Address" style={styles.input} />
      <TextInput placeholder="Aadhar Details" style={styles.input} />
      <TextInput placeholder="Ration Card No." style={styles.input} />
      <TextInput placeholder="Income Certificate No." style={styles.input} />
      <TextInput placeholder="Bank Account No." style={styles.input} />
      <TextInput placeholder="IFSC Code" style={styles.input} />

      <TouchableOpacity style={styles.photoButton} onPress={capturePhoto}>
        <Text style={styles.photoButtonText}>Capture Photo</Text>
      </TouchableOpacity>

      {photo && <Image source={{ uri: photo }} style={styles.photoPreview} />}

      <Button title="Submit" onPress={() => navigation.navigate('LoanDetails')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginVertical: 10 },
  photoButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  photoButtonText: { color: '#fff', fontWeight: 'bold' },
  photoPreview: { width: '100%', height: 200, marginTop: 20, borderRadius: 5 },
});

export default KYCScreen;
