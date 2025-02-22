import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, router, useRouter } from 'expo-router';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Constants from 'expo-constants';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { logout, user } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/")
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={hp(3.5)} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          {/* Optional button for future functionality */}
        </TouchableOpacity>
      </View>
      
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Ionicons name="person-circle-outline" size={hp(12)} color="#555" style={styles.icon} />
        <Text style={styles.name}>{user ? user.name : "Unknown Person"}</Text>
      </View>
      
      {/* Information Section */}
      <View style={styles.infoContainer}>
        <ProfileItem icon="mail-outline" label="Email" value={user ? user.email : "Unknown"} />
        <ProfileItem icon="globe-outline" label="Country" value={user ? user.country : "Unknown"} />
        <ProfileItem icon="location-outline" label="IP Address" value={user ? user.ipAddress : "Unknown"} />
        <ProfileItem icon="key-outline" label="Password" value="********" />
      </View>
      
      {/* App Version */}
      <Text style={styles.version}>
        App Version: {Constants.expoConfig?.version || '1.0.0'}
      </Text>
      
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const ProfileItem = ({ icon, label, value }) => (
  <View style={styles.item}>
    <Ionicons name={icon} size={hp(3)} color="#777" />
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: wp(5),
    alignItems: 'center',
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: hp(2.5),
    fontWeight: '600',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: hp(3),
  },
  icon: {
    marginBottom: hp(1.5),
  },
  name: {
    fontSize: hp(3),
    fontWeight: 'bold',
    color: '#444',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: wp(3),
    padding: wp(5),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: hp(2),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  label: {
    flex: 1,
    fontSize: hp(2),
    color: '#555',
    marginLeft: wp(3),
  },
  value: {
    fontSize: hp(2),
    color: '#333',
    fontWeight: 'bold',
  },
  version: {
    marginTop: hp(1),
    fontSize: hp(1.8),
    color: '#888',
  },
  logoutButton: {
    marginTop: hp(4),
    backgroundColor: '#E63946',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(10),
    borderRadius: wp(2),
    elevation: 2,
  },
  logoutText: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: '#FFF',
  },
});