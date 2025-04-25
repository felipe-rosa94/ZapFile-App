import { NetworkInfo } from 'react-native-network-info'

export const getIp = async (): Promise<string> => {
    try {
        return await new Promise((resolve, reject) => {
            NetworkInfo.getIPV4Address()
                .then(value => resolve(value || ''))
                .catch(() => reject('Erro ao obter IP'))
        })
    } catch (err) {
        return '0.0.0.0'
    }
}

export const getHostname = async (): Promise<string> => {
    try {
        return await new Promise((resolve, reject) => {
            NetworkInfo.getSSID()
                .then(value => resolve(value || ''))
                .catch(() => reject('Erro ao obter Hostname'))
        })
    } catch (err) {
        return ''
    }
}