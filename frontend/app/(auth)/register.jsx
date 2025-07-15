import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const colors = {
  primary: 'rgb(50, 160, 65)',
  danger: 'rgb(200, 25, 30)',
  black: 'rgb(0, 0, 0)',
  white: '#FFFFFF',
  lightGray: '#f0f0f0',
  mediumGray: '#ccc',
  darkGray: '#555',
};

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState('student'); 
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (password !== passwordConfirmation) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, passwordConfirmation, role);
    setLoading(false);

    if (result.success) {
      Alert.alert('Sucesso!', 'Sua conta foi criada com sucesso.');
    } else {
      Alert.alert('Erro no Cadastro', result.error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <FontAwesome name="user-plus" size={50} color={colors.primary} style={{ marginBottom: 20 }} />
        <Text style={styles.title}>Crie sua Conta</Text>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Nome Completo" value={name} onChangeText={setName} autoCapitalize="words" placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Confirme a Senha" value={passwordConfirmation} onChangeText={setPasswordConfirmation} secureTextEntry placeholderTextColor="#999" />
        </View>

        <Text style={styles.roleLabel}>Eu sou:</Text>
        <View style={styles.roleContainer}>
          <Pressable
            style={[styles.roleButton, role === 'student' && styles.roleButtonActive]}
            onPress={() => setRole('student')}
          >
            <Text style={[styles.roleButtonText, role === 'student' && styles.roleButtonTextActive]}>Aluno</Text>
          </Pressable>
          <Pressable
            style={[styles.roleButton, role === 'nutricionist' && styles.roleButtonActive]}
            onPress={() => setRole('nutricionist')}
          >
            <Text style={[styles.roleButtonText, role === 'nutricionist' && styles.roleButtonTextActive]}>Nutricionista</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </Pressable>

        <Link href="/(auth)/login" asChild>
          <Pressable disabled={loading}>
            <Text style={styles.link}>Já tem uma conta? <Text style={styles.linkBold}>Faça Login</Text></Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: colors.primary,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: colors.mediumGray,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    fontSize: 16,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
    backgroundColor: colors.mediumGray,
    borderRadius: 25,
    overflow: 'hidden',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  roleButtonTextActive: {
    color: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: colors.mediumGray,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    color: colors.darkGray,
    textAlign: 'center',
    fontSize: 16,
  },
  linkBold: {
    fontWeight: 'bold',
    color: colors.primary,
  }
});
