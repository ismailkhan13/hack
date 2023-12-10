
import React, { useState, createContext } from 'react'
import { ethers, } from 'ethers';
import "./ConnectAccount.scss";
import LeftBanner from '../onboarding/left-banner/LeftBanner';
import logo from "./../../assets/images/logo.jpeg"
import { useNavigate, useParams } from 'react-router-dom';
import { setDataOnLocalStorage } from '../../utils/globalUtilities';

declare global {
    interface Window { ethereum: any; }
}

window.ethereum = window.ethereum;


const ConnectAccount = (props: any) => {
    const [WA, setWA] = useState("");
    const [walletBalance, setWalletBalance] = useState<string>();
    const navigate = useNavigate()
    
    
    async function reqEthAccount() {
        if (window.ethereum) {
            console.log('Wallet present');
            
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                console.log({ accounts });
                
                setWA(accounts[0]);
                
                const provider = new ethers.BrowserProvider(window.ethereum);
                let balance = await provider.getBalance(accounts[0]);
                let fmtBlc = ethers.formatUnits(balance);
                props.setUserDetails({
                    isLoggedIn: true,
                    userDetails: {
                        balance: fmtBlc,
                        //address
                        address:accounts[0]
                    }
                });
                setWalletBalance(fmtBlc);
                navigate('/surveys')
                setDataOnLocalStorage('userDetails',JSON.stringify({
                    isLoggedIn: true,
                    userDetails: {
                        balance: fmtBlc,
                        //address
                        address:accounts[0]
                    }
                }))
                //local me dalo

            } catch (error) {
                console.log({ error });

                console.log('Error connecting...');
            }

        } else {
            alert('Meta Mask/Wallet not detected');
        }
    }


    return (
        <div className='connect-acc-page tw-flex '>

            <LeftBanner />
            <div>
                <div className='tw-flex tw-gap-6 tw-justify-end tw-items-center'>
                    <p className='section-heading survey-heading'>SurveyX</p>
                    <div className='survey-logo-container'>
                        <img className='logo' src={`${logo}`}></img>
                    </div>
                </div>

                <div className='wrapper tw-flex tw-justify-center tw-flex-col tw-items-center tw-gap-10 tw-p-4'>
                    <p className='tw-text-2xl tw-font-bold tw-text-secondary tw-italic tw-text-center'>Connect with your Account to get started with the ....</p>
                    <div className='tw-flex tw-justify-center tw-flex-col tw-items-center'>
                        <button onClick={reqEthAccount} className='tw-flex tw-items-center tw-text-lg btn btn--blue'> <img className='tw-w-10 tw-mr-2' src='/metamask.png'></img> Connect Your Account</button>
                        {/* <p className='tw-text-xl tw-font-semibold tw-my-4' >Your wallet address is - {WA}</p> */}

                        {/* <p className='tw-text-lg'>Current Balance: {walletBalance}</p> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConnectAccount