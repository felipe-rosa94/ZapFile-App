import AsyncStorage from '@react-native-async-storage/async-storage'

const getLocal = async (key: string, value: any = '') => {
    const data: string | null = await AsyncStorage.getItem(key)
    if (!data) return value
    return JSON.parse(data || '')
}

const setLocal = (key: string, data: any = '') => AsyncStorage.setItem(key, JSON.stringify(data))

const removeLocal = (key: string) => AsyncStorage.removeItem(key)

const clearLocal = () => AsyncStorage.clear()

export {
    getLocal,
    setLocal,
    removeLocal,
    clearLocal
}
