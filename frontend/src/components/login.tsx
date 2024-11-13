import { GoogleLogin, CredentialResponse} from '@react-oauth/google';

const clientId = "202435428933-3lre5ob5rajcfimt8q4r64c9n2a1t7cl.apps.googleusercontent.com";

const Login: React.FC = () => {

    const onSuccess = (res : CredentialResponse) => {
        console.log('[Login Success] currentUser:', res);
        //add backend functionality here
    };

    const onFailure = () => {
        console.log('[Login Failed]');
    }

    return(
        <div id="google-login">
            <h2>Login with Google</h2>
            <GoogleLogin
                onSuccess={onSuccess}
                onError={onFailure}
            />
        </div>
    )
}

export default Login;