import { createContext, ReactNode, useEffect, useState } from 'react';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import Router from 'next/router';
import { api } from '../services/apiClient';

interface AuthData {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signUp: (credentials: SignUpProps) => Promise<void>;
    logoutUser: () => Promise<void>; //Usa async e await sem return
}

interface UserProps {
    id: string;
    name: string;
    email: string;
    address: string | null;
    subscriptions?: SubscriptionsProps | null;
}

interface SubscriptionsProps {
    id: string;
    status: string;
}

type AuthProps = {
    children: ReactNode;
}

interface SignInProps {
    email: string;
    password: string;
}

interface SignUpProps {
    name: string;
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthData);

export function signOut() {
    try {
        destroyCookie(null, '@barber.token', {path: '/'});
        Router.push('/login');
    } catch(error) {
        console.log(error);
    }
}

export function AuthProvider({children}: AuthProps) {
    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;

    useEffect(() => {
        const { '@barber.token': token } = parseCookies();

        if(token) {
            api.get('/me').then((response) => {
                const { id, name, email, address, subscriptions } = response.data;
                
                setUser({id, name, email, address, subscriptions});
            })
            .catch(() => {
                signOut();
            })
        }
    }, []);

    async function signIn({email, password}: SignInProps) {
        try {
            const response = await api.post('/session', {
                email,
                password,
            });

            const { id, name, token, subscriptions, address } = response.data;
            setCookie(undefined, '@barber.token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
            });

            setUser({id, name, email, address, subscriptions});
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            Router.push('/dashboard');
        } catch(error) {
            console.log(error);
        }     
    }

    async function signUp({name, email, password}: SignUpProps) {
        try {
            const response = await api.post('/users', {
                name,
                email,
                password,
            });

            Router.push('/login');
        } catch(error) {
            console.log(error);
        }
    }

    async function logoutUser() {
        try {
            destroyCookie(null, '@barber.token', {path: '/'});
            setUser(null);
            Router.push('/login');
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, signIn, signUp, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}