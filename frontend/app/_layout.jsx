import { AuthProvider, useAuth } from '../context/AuthContext'; // Adicione useAuth aqui
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const InitialLayout = () => {
    const { authenticated, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (authenticated && inAuthGroup) {
            router.replace('/(app)/student-menu');
        } else if (!authenticated && !inAuthGroup) {
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

    return <Stack screenOptions={{ headerShown: false }} />;
};

export default function RootLayout() {
    return (
        <AuthProvider>
            <InitialLayout />
        </AuthProvider>
    );
}