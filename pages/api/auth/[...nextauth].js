import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import {loginUser, refreshToken} from '../../../src/utils/login';

const createUserObject = (response, children)=> {
    return {
        databaseId: response?.user?.databaseId,
        id: response?.user?.id,
        username: response?.user?.username,
        accessToken: response?.user?.jwtAuthToken,
        firstName: response?.user?.firstName,
        lastName: response?.user?.lastName,
        email: response?.user?.email,
        token_exp: response?.user?.jwtAuthExpiration,
        refreshToken: response?.user?.jwtRefreshToken,
        jwt_secret: response?.user?.jwtUserSecret,
        nicename: response?.user?.nicename,
        customer: response?.customer,
        roles: response?.user?.roles,
    };
}

async function refreshAccessToken(token) {
    try {
        const data = await refreshToken(token?.refreshToken, token?.user?.databaseId);
        return {
            ...token,
            accessToken: data?.token,
            refreshToken: token?.refreshToken,
            accessTokenExpires: (Date.now() / 1000) + 300,
            user: {
                ...token?.user,
                ...data?.user
            }
        }

    } catch (error) {
        return {
            error: error,
        }
    }
}

const createOptions = (req) => (
    {
    secret: process.env.SECRET,
    providers: [
        CredentialsProvider({
        // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "email", placeholder: "your@email.com" },
                password: {  label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const {data, errors} = await loginUser( credentials );
                // If no error and we have user data, return it
                if (!errors) {
                    return createUserObject(data?.login);
                }
                return errors
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        async session({token, session}) {
            if (token) {
                session.user = token.user
                session.accessToken = token.accessToken
                session.error = token.error
            }
            return session
        },
        async jwt({token, user, account}) {
            if (account && user) {
                const token_exp = parseInt(user?.token_exp, 10);
                return {
                    accessToken: user.accessToken,
                    accessTokenExpires: token_exp,
                    refreshToken: user.refreshToken,
                    user,
                }
            }
            if( req.url.indexOf('?update') !== -1 ) {
                return refreshAccessToken(token);
            }
            const now = Date.now() / 1000;
            if (now < token.accessTokenExpires) {
                return token
            }
            return refreshAccessToken(token);
        },
    }
}
);

export default async (req, res) => {
  return NextAuth(req, res, createOptions(req));
};