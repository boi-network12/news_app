import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import React, { useContext, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Link, useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import { TouchableWithoutFeedback } from 'react-native';

export default function Login() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');
    Keyboard.dismiss(); // Dismiss the keyboard when loading starts

    try {
      const userData = { email, password };
      await login(userData);
      router.replace('/'); // Navigate to the home screen after successful login
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Welcome Back</Text>

        {/* Error Message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name='mail-outline' size={20} color='#888' style={styles.icon} />
          <TextInput
            placeholder='Email'
            placeholderTextColor="#666"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            selectionColor="#333"
            editable={!loading} // Disable input when loading
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name='lock-closed-outline' size={20} color='#888' style={styles.icon} />
          <TextInput
            placeholder='Password'
            placeholderTextColor="#666"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            selectionColor="#333"
            editable={!loading} // Disable input when loading
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => router.push('/forgot-password')} disabled={loading}>
          <Text style={[styles.forgotPassword, loading && { opacity: 0.6 }]}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Signup Link */}
        <Text style={styles.signupText}>
          Don't have an account?
          <Link href='/register' asChild>
            <Text style={styles.signupLink}> Sign Up</Text>
          </Link>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: wp(5),
    justifyContent: 'center',
  },
  title: {
    fontSize: hp(3.5),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(4),
    color: '#333',
  },
  errorText: {
    fontSize: hp(1.8),
    color: '#E63946',
    textAlign: 'center',
    marginBottom: hp(2),
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
    flex: 1,
    fontSize: hp(2),
    color: '#333',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: hp(3),
    fontSize: hp(1.8),
    color: '#333',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#333',
    paddingVertical: hp(2),
    borderRadius: hp(1),
    alignItems: 'center',
    marginTop: hp(2),
  },
  loginText: {
    color: '#FFF',
    fontSize: hp(2.2),
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: hp(3),
    fontSize: hp(2),
    textAlign: 'center',
    color: '#666',
  },
  signupLink: {
    color: '#333',
    fontWeight: 'bold',
  },
});

