// cf https://github.com/ssauli/sveltekit-cognito-auth/tree/main
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import {
    CognitoUser,
    AuthenticationDetails,
    CognitoUserSession,
} from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: import.meta.env.VITE_USER_POOL_ID,
    ClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID
};
export const userPool = new CognitoUserPool(poolData);

export const verifier = CognitoJwtVerifier.create({
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    tokenUse: 'access',
    clientId: import.meta.env.VITE_USER_POOL_CLIENT_ID
});

// region: import.meta.env.VITE_REGION,
// userPoolId: import.meta.env.VITE_USER_POOL_ID,
// identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
// userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID

export const cognitoLogin = (email: string, password: string) => {
    const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
    });
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });

    return new Promise<CognitoUserSession>((resolve, reject) => {
        return cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: resolve,
            onFailure: reject,
        });
    });
};