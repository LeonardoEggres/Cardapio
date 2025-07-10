import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

export default function AppLayout() {
    const { logout } = useAuth();
    const router = useRouter();

    return (
        <Tabs screenOptions={{
            headerRight: () => <Button onPress={logout} title="Sair" color="red" />,
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Cardápios',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="list-alt" color={color} />,
                }}
            />
            <Tabs.Screen
                name="daily-menu"
                options={{
                    title: 'Cardápio do Dia',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="calendar-check-o" color={color} />,
                }}
            />
            <Tabs.Screen
                name="users"
                options={{
                    title: 'Usuários',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
                }}
            />
            <Tabs.Screen name="menus/[id]" options={{ href: null, title: 'Detalhes do Cardápio' }} />
            <Tabs.Screen name="menus/create" options={{ href: null, title: 'Novo Cardápio' }} />
            <Tabs.Screen name="menus/edit/[id]" options={{ href: null, title: 'Editar Cardápio' }} />
        </Tabs>
    );
}