import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'expo-router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
        const result = await login(email, password);
        if (!result.success) {
            Alert.alert('Erro de Login', result.error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
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
            <Button title="Entrar" onPress={handleLogin} />
            <Link href="/register" asChild>
                <Pressable>
                    <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
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
});