import React, { useState, useRef } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectOrderId } from '../reducers/flowSlice';
import { checkAccount } from '../requests/embedded';
import useScript from '../utils/hooks/useScript';
import styles from './checkout.module.scss';

const CDN_URL = "https://connect-sandbox.bolt.com";
const PUBLISHABLE_KEY = "FILL_IN";
const BUTTON_BASE_URL = "https://connect-sandbox.bolt.com/v1/checkout_button";
const EMAIL_VALIDATION_REGEX = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

// TODO: Move to annother class
class AccountStore {
    authorization: any;
    constructor(authorization: any) {
        this.authorization = authorization;
    }

    async getAccountSummary() {
        let response = await post("/account", this.authorization);
        let json = await response.json();
        return json;
    }

    async addPaymentMethod(paymentMethod: any) {
        paymentMethod.authorizationCode = this.authorization.authorizationCode;
        paymentMethod.type = "card";
        if (!paymentMethod.billing_address_id) {
            throw new Error("Require billing address id");
        }
        let response = await post("/payment-methods", paymentMethod);
        let json = await response.json();
        return json;
    }
}

async function post(url: string, data: string) {
    return fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}


const Checkout = () => {
    const orderId = useAppSelector(selectOrderId);
    const emailRef = useRef(null)
    const [checkoutSuccessful, setCheckoutSuccessful] = useState(false);
    const [email, setEmail] = useState("");

    useScript(`${CDN_URL}/track.js`, "bolt-track", "text/javascript", [{ key: "data-publishable-key", value: PUBLISHABLE_KEY }]);
    useScript(`${CDN_URL}/connect.js`, "bolt-connect", "text/javascript", [{ key: "data-publishable-key", value: PUBLISHABLE_KEY }]);
    useScript(`${CDN_URL}/embed-accounts.js`, "bolt-embedded-accounts", "text/javascript", []);

    const handleEmailUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        setEmail(input);

        if(EMAIL_VALIDATION_REGEX.test(input)) {
            const hasBoltAccount = await accountExists(input);
            if(hasBoltAccount) {
                loadEmbedded(input);
            }
        }
    }

    const accountExists = async (email: string) => { 
        const hasBoltAccount = await checkAccount(email);
        return hasBoltAccount;
    };
    
    const loadEmbedded = async (email: string) => {
        const boltEmbedded = window.Bolt(PUBLISHABLE_KEY);
        let authorizationResponse;
        try {
            const authorizeComponent = boltEmbedded.create("authorization_component",  { style: { position: "center" } });
            await authorizeComponent.mount(".email-div");

            authorizationResponse = await authorizeComponent.authorize({"email": email });
        } catch(error) {
            console.log('ERROR: ', error);
        }

        console.log(authorizationResponse)

        // let accountStore = new AccountStore(authorizationResponse);
        // let accountSummary = await accountStore.getAccountSummary();
        // console.log(accountSummary)
    }

    const hints = {};
    const cart = {
        orderToken: orderId,
    };
    const callbacks = {
        check: function () { return true },
        onCheckoutStart: function () {},
        onEmailEnter: function (email: string) {},
        onShippingDetailsComplete: function (address: any) {},
        onShippingOptionsComplete: function () {},
        onPaymentSubmit: function () {},
        success: function (transaction: any, callback: any) {
            setCheckoutSuccessful(true);
            console.log("Checkout successful");
        },
        close: function () {},
    };

    window.BoltCheckout.configure(cart, hints, callbacks);

    return (
        <div>
            <p className={styles.token}>Token <strong>{orderId}</strong></p>
            <div id="email-div" className="email-div" ref={emailRef}>
                <input type="email" placeholder="Email" required className={styles.emailInput} value={email} onChange={handleEmailUpdate}/>
            </div>
            <div className={styles.guestCheckoutContainer}>
                {checkoutSuccessful ? (
                    <p className={styles.checkoutSuccessful}>Checkout successful!</p>
                ) : (
                    <div data-tid="instant-bolt-checkout-button">
                        <object data={`${BUTTON_BASE_URL}?publishable_key=${PUBLISHABLE_KEY}`} aria-label={"bolt-checkout-button"}/>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Checkout;
