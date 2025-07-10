import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageService = {
    async setItem(key, value) {
        if (Platform.OS === 'web') {
            try {
                await AsyncStorage.setItem(key, value);
            } catch (e) {
                console.error('Failed to save to AsyncStorage', e);
            }
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    },

    async getItem(key) {
        if (Platform.OS === 'web') {
            try {
                return await AsyncStorage.getItem(key);
            } catch (e) {
                console.error('Failed to get from AsyncStorage', e);
                return null;
            }
        } else {
            return await SecureStore.getItemAsync(key);
        }
    },

    async deleteItem(key) {
        if (Platform.OS === 'web') {
            try {
                await AsyncStorage.removeItem(key);
            } catch (e) {
                console.error('Failed to remove from AsyncStorage', e);
            }
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    },
};

export default StorageService;