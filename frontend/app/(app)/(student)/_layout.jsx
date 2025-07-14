import React from 'react';
import { Tabs } from 'expo-router';
import { Button } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

export default function StudentLayout() {
    const { logout } = useAuth();

    return (
        <Tabs screenOptions={{
            headerRight: () => <Button onPress={logout} title="Sair" color="red" />,
        }}>
            <Tabs.Screen
                name="student-menu"
                options={{
                    title: 'Meu Cardápio',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="cutlery" color={color} />,
                }}
            />
            <Tabs.Screen
                name="student-preference"
                options={{
                    title: 'Preferência',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="sliders" color={color} />,
                }}
            />
        </Tabs>
    );
}