// frontend/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', { email, password });

      console.log('Resposta da API:', response.data);

      const { access_token, user } = response.data;

      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      const storedToken = await AsyncStorage.getItem('token');
      console.log('Token armazenado:', storedToken);

      if (user.role === 'student') {
        navigation.navigate('StudentMenu');
      } else if (user.role === 'nutricionist') {
        navigation.navigate('NutricionistDashboard');
      }
    } catch (error) {
      Alert.alert('Erro', 'Credenciais inválidas.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Novo botão para navegar para o registro */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Não tem uma conta? Cadastre-se aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#0d6efd',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  registerText: {
    color: '#0d6efd',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 14
  }
});
