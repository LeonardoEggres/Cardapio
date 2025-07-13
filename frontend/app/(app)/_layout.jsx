import React from 'react';
import { Tabs } from 'expo-router';
import { Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

export default function AppLayout() {
    const { logout, user } = useAuth();

    if (!user) return null;

    if (user.role === 'student') {
        return (
            <Tabs screenOptions={{
                headerRight: () => <Button onPress={logout} title="Sair" color="red" />,
            }}>
                <Tabs.Screen
                    name="student-menu"
                    options={{
                        title: 'Cardápio',
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
                {/* Esconde todas as outras rotas do aluno */}
                <Tabs.Screen name="users" options={{ href: null }} />
                <Tabs.Screen name="preference" options={{ href: null }} />
                <Tabs.Screen name="menus/[id]" options={{ href: null }} />
                <Tabs.Screen name="menus/create" options={{ href: null }} />
                <Tabs.Screen name="menus/edit/[id]" options={{ href: null }} />
                <Tabs.Screen name="index" options={{ href: null }} />
                <Tabs.Screen name="dayli-menu" options={{ href: null }} />
                <Tabs.Screen name="weekly-menu" options={{ href: null }} />
                <Tabs.Screen name="nutricionist-menus" options={{ href: null }} />
                <Tabs.Screen name="nutricionist-users" options={{ href: null }} />
            </Tabs>
        );
    }

    if (user.role === 'nutricionist') {
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
                {/* Esconde todas as outras rotas do nutricionista */}
                <Tabs.Screen name="student-menu" options={{ href: null }} />
                <Tabs.Screen name="student-preference" options={{ href: null }} />
                <Tabs.Screen name="users" options={{ href: null }} />
                <Tabs.Screen name="preference" options={{ href: null }} />
                <Tabs.Screen name="menus/[id]" options={{ href: null }} />
                <Tabs.Screen name="menus/create" options={{ href: null }} />
                <Tabs.Screen name="menus/edit/[id]" options={{ href: null }} />
                <Tabs.Screen name="index" options={{ href: null }} />
                <Tabs.Screen name="dayli-menu" options={{ href: null }} />
                <Tabs.Screen name="weekly-menu" options={{ href: null }} />
            </Tabs>
        );
    }

    return null;
}