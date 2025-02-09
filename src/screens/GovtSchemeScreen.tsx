import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';

const GovtSchemeScreen = () => {
  const schemes = [
    {
      name: 'PMAY - Pradhan Mantri Awas Yojana',
      description: 'A scheme aimed at providing affordable housing for all.',
      link: 'https://pmaymis.gov.in/',
    },
    {
      name: 'PMGSY - Pradhan Mantri Gram Sadak Yojana',
      description: 'A scheme to improve road infrastructure in rural areas.',
      link: 'https://www.pmgsy.nic.in/',
    },
    {
      name: 'MUDRA - Micro Units Development & Refinance Agency',
      description:
        'A scheme for providing financial support to micro businesses.',
      link: 'https://www.mudra.org.in/',
    },
    {
      name: 'Startup India',
      description: 'A scheme that supports the growth of startups in India.',
      link: 'https://www.startupindia.gov.in/',
    },
    {
      name: 'Atal Pension Yojana',
      description:
        'A pension scheme to provide a secure future for workers in the unorganized sector.',
      link: 'https://www.npscra.nsdl.co.in/',
    },
    // Add more schemes as required
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Government Schemes</Text>

      {schemes.map((scheme, index) => (
        <View key={index} style={styles.schemeContainer}>
          <Text style={styles.schemeName}>{scheme.name}</Text>
          <Text style={styles.schemeDescription}>{scheme.description}</Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL(scheme.link)}>
            <Text style={styles.linkText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  schemeContainer: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    elevation: 3,
  },
  schemeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  schemeDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  linkButton: {
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GovtSchemeScreen;
