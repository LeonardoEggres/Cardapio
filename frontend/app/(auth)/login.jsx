import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Alert,
    Pressable,
    ActivityIndicator
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

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
        setLoading(true); 
        const result = await login(email, password);
        if (!result.success) {
            Alert.alert('Erro de Login', result.error);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <FontAwesome name="user-circle" size={60} color={colors.primary} style={{ marginBottom: 20 }} />

            <Text style={styles.title}>Bem-vindo(a)!</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Sua senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                />
            </View>

            <Pressable
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={colors.white} />
                ) : (
                    <Text style={styles.buttonText}>Entrar</Text>
                )}
            </Pressable>

            <Link href="/(auth)/register" asChild>
                <Pressable disabled={loading}>
                    <Text style={styles.link}>Não tem uma conta? <Text style={styles.linkBold}>Cadastre-se</Text></Text>
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: colors.white,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: colors.primary,
    },
    subtitle: {
        fontSize: 16,
        color: colors.darkGray,
        textAlign: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 10,
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
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 20,
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
