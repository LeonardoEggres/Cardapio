import { AuthProvider, useAuth } from '../context/AuthContext';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const InitialLayout = () => {
    const { authenticated, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        console.log('[ROOT LAYOUT] Verificando estado...');
        console.log('[ROOT LAYOUT] Autenticado:', authenticated);
        console.log('[ROOT LAYOUT] Carregando:', isLoading);
        if (isLoading) {
            return;
        }

        const inAuthGroup = segments[0] === '(auth)';

        if (authenticated && inAuthGroup) {
            console.log('[ROOT LAYOUT] Usuário autenticado, redirecionando para a área (app)...');
            router.replace('/(app)');
        }
        else if (!authenticated && !inAuthGroup) {
            console.log('[ROOT LAYOUT] Usuário NÃO autenticado, redirecionando para o login...');
            router.replace('/(auth)/login');
        }

    }, [authenticated, isLoading]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return <Slot />;
};

export default function RootLayout() {
    return (
        <AuthProvider>
            <InitialLayout />
        </AuthProvider>
    );
}