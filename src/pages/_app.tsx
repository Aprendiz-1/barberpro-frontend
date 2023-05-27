import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import { AuthProvider } from '../contexts/AuthContext'

const styles = {
  global: {
    body: {
      color: 'gray.100',
    },
    a: {
      color: '#FFF',
    },
  }
};

const colors = {
  barber:{
    900: '#12131b',
    400: '#1c1e30',
    100: '#c6c6c6'
  },
  button:{
    cta: '#ee9a1d',
    default: '#FFF',
    gray: '#DFDFDF',
    danger: '#FF4040',
  },
  orange: {
    900: '#ee9a1d'
  }
}

const theme = extendTheme({ styles, colors });

function App({ Component, pageProps }: AppProps) {
  return ( 
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
