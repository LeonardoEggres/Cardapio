import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';

export default function AppIndexPage() {
    const { user, isLoading } = useAuth();

    console.log('Verificando usuário no redirecionamento:', user);

    if (isLoading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    if (!user) {
        console.log('Nenhum usuário encontrado, redirecionando para /login');
        return <Redirect href="/login" />;
    }

    if (user.role === 'student') {
        console.log('Perfil de ALUNO detectado, redirecionando...');
        return <Redirect href="/(student)/student-menu" />;
    }

    if (user.role === 'nutricionist') {
        console.log('Perfil de NUTRICIONISTA detectado, redirecionando...');
        return <Redirect href="/(nutricionist)/nutricionist-menus" />;
    }

    console.log(`Perfil desconhecido ('${user.role}'), redirecionando para /login`);
    return <Redirect href="/login" />;
}