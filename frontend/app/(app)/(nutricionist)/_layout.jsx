import React from 'react';
import { Tabs } from 'expo-router';
import { Button } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

export default function NutricionistLayout() {
    const { logout } = useAuth();

    return (
        <Tabs screenOptions={{
            headerRight: () => <Button onPress={logout} title="Sair" color="red" />,
        }}>
            <Tabs.Screen
                name="nutricionist-menus"
                options={{
                    title: 'Cardápios',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="list-alt" color={color} />,
                }}
            />
            <Tabs.Screen
                name="nutricionist-users"
                options={{
                    title: 'Alunos',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
                }}
            />

            {/* Oculta as rotas de CRUD da barra de abas, mas permite a navegação */}
            <Tabs.Screen name="menus/[id]" options={{ href: null, title: 'Detalhes do Cardápio' }} />
            <Tabs.Screen name="menus/create" options={{ href: null, title: 'Novo Cardápio' }} />
            <Tabs.Screen name="menus/edit/[id]" options={{ href: null, title: 'Editar Cardápio' }} />
        </Tabs>
    );
}