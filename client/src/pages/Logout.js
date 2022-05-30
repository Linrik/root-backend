import React from 'react';
import { LoginContext } from '../routerTemplate/Template';
import { useNavigate } from 'react-router-dom';
const axios = require('axios').default

const Logout = () => {
    const {login, loginMode} = React.useContext(LoginContext)
    const navigate = useNavigate();
    
    

    React.useEffect(() => {
        const fetchLogout = async () => {
            await axios({
                method: 'get',
                url: '/api/user/logout',
                withCredentials: true,
            }).then((response)=>{
                loginMode.Template();
                navigate('/');
            }).catch(function (error){
                console.log(error)
            })
        }
        fetchLogout();
    }, [loginMode, navigate]);
    
    return (
        <div>Redirecting...</div>
    );
};

export default Logout;
