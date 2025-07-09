import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState('student'); // Padrão aluno
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert('Erro no cadastro', JSON.stringify(error.response?.data));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
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
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        secureTextEntry
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
      />

      <Text>Função:</Text>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'student' && styles.roleButtonSelected]}
          onPress={() => setRole('student')}
        >
          <Text style={role === 'student' ? styles.roleTextSelected : styles.roleText}>Aluno</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleButton, role === 'nutricionist' && styles.roleButtonSelected]}
          onPress={() => setRole('nutricionist')}
        >
          <Text style={role === 'nutricionist' ? styles.roleTextSelected : styles.roleText}>Nutricionista</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
  button: { backgroundColor: '#0d6efd', padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  roleButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#0d6efd',
    borderColor: '#0d6efd',
  },
  roleText: { color: '#000' },
  roleTextSelected: { color: '#fff', fontWeight: 'bold' },
});
