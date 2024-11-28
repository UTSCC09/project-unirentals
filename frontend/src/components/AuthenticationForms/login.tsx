import { GoogleLogin, CredentialResponse} from '@react-oauth/google';
import axios  from 'axios';
const clientId = "202435428933-3lre5ob5rajcfimt8q4r64c9n2a1t7cl.apps.googleusercontent.com";

const Login: React.FC = () => {

    const onSuccess = async (res : CredentialResponse) => {
        try{
            if(res.credential){
                console.log('[Login Success] credential:', res.credential);

                const response = await axios.post('http://127.0.0.1:8000/api/oauth/', {
                    token: res.credential
                });
                if(response.status === 200){
                    console.log('[Login Success] User authenticated:', response.data);
                }
                
            }else{
                console.log('[Login Failed] credential:', res.credential);
            }
        }catch(error){
            console.log(error);
        }     
    };

    const onFailure = () => {
        console.log('[Login Failed]');
    }

    return(
        <div id="google-login">
            <GoogleLogin
                onSuccess={onSuccess}
                onError={onFailure}
            />
        </div>
    )
}

export default Login;