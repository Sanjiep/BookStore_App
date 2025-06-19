import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const AuthLayout = () => {
  return(
    <SafeAreaProvider>
     <Stack screenOptions={{headerShown: false}} />
    </SafeAreaProvider>
  )
}

export default AuthLayout