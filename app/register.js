import { ActivityIndicator, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Link, useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const { register } = useContext(AuthContext);
  const router = useRouter()
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');

  const handleRegister = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const response = await register(name, email, password);
      
      
      // Ensure the response is valid before navigating
      if (response && response.success) {
        router.replace('/');
      } else {
        setError("Registration failed: Email already in use", response);
      }
    } catch (error) {
      setError("Registration failed:", error);
  
      // If error is an HTTP response, log full details
      if (error.response) {
        const text = await error.response.text(); 
        setError("Server Response Text:", text);
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      

      <Text style={styles.title}>Create Account</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Ionicons name='person-outline' size={20} color='#888' style={styles.icon} />
        <TextInput 
          placeholder='Full Name' 
          style={styles.input} 
          value={name} 
          onChangeText={setName} 
          selectionColor="#333"
          editable={!loading}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name='mail-outline' size={20} color='#888' style={styles.icon} />
        <TextInput 
          placeholder='Email' 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail}
          keyboardType='email-address'
          selectionColor="#333"
          editable={!loading}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name='lock-closed-outline' size={20} color='#888' style={styles.icon} />
        <TextInput 
          placeholder='Password' 
          style={styles.input} 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry
          selectionColor="#333"
          editable={!loading}
        />
      </View>

      {/* Register Button */}
      <TouchableOpacity 
          style={[styles.registerButton, loading && { opacity: 0.6 }]} 
          onPress={handleRegister}
          disabled={loading}
      >
      {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.registerText}>Sign Up</Text>}
      </TouchableOpacity>

      {/* Login Link */}
      <Text style={styles.loginText}>
        Already have an account? 
        <Link href='/login' asChild>
          <Text style={styles.loginLink}> Login</Text>
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: wp(5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    height: hp(8),
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
  },
  errorText: {
    fontSize: hp(1.8),
    color: '#E63946',
    textAlign: 'center',
    marginBottom: hp(2),
  },
  headerTitle: {
    fontSize: hp(2.5),
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: wp(3),
  },
  title: {
    fontSize: hp(3.5),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp(4),
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#E0E0E0',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: hp(1),
    marginBottom: hp(2),
  },
  icon: {
    marginRight: wp(2),
  },
  input: {
    color: '#333', // Change this to a visible color
    fontSize: hp(2.2),
    fontWeight: 'bold',
    flex: 1, // Ensure input takes available space
  },  
  registerButton: {
    backgroundColor: '#333',
    paddingVertical: hp(2),
    borderRadius: hp(1),
    alignItems: 'center',
    marginTop: hp(3),
  },
  registerText: {
    color: '#FFF',
    fontSize: hp(2.2),
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: hp(3),
    fontSize: hp(2),
    textAlign: 'center',
    color: '#666',
  },
  loginLink: {
    color: '#333',
    fontWeight: 'bold',
  },
});
