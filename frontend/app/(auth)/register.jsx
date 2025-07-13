import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Link, useRouter } from 'expo-router';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState('student');
  
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (password !== passwordConfirmation) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    const result = await register(name, email, password, passwordConfirmation, role);

    if (result.success) {
      Alert.alert('Sucesso!', 'Sua conta foi criada.');
    } else {
      Alert.alert('Erro no Cadastro', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirme a Senha"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />
      
      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Tipo de usuário:</Text>
        <Button title="Aluno" onPress={() => setRole('student')} color={role === 'student' ? 'green' : 'gray'} />
        <Button title="Nutricionista" onPress={() => setRole('nutricionist')} color={role === 'nutricionist' ? 'green' : 'gray'} />
      </View>
      
      <Button title="Cadastrar" onPress={handleRegister} />
      
      <Link href="/login" asChild>
        <Pressable>
            <Text style={styles.link}>Já tem uma conta? Faça Login</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { height: 45, borderColor: 'gray', borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
  link: { marginTop: 20, color: 'blue', textAlign: 'center' },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  roleLabel: { fontWeight: 'bold', marginBottom: 5 },
});