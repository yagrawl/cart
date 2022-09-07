import React, { useState, useRef } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectOrderId } from '../reducers/flowSlice';
import useScript from '../utils/hooks/useScript';
import styles from './checkout.module.scss';

const CDN_URL = "https://connect-sandbox.bolt.com";
const PUBLISHABLE_KEY = "FILL_IN";
const BUTTON_BASE_URL = "https://connect-sandbox.bolt.com/v1/checkout_button";


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
    // TODO: Having issues with not being to access elements in the DOM - this seemed to have fixed it
    const emailRef = useRef(null)
    const [checkoutSuccessful, setCheckoutSuccessful] = useState(false);

    useScript(`${CDN_URL}/track.js`, "bolt-track", "text/javascript", [{ key: "data-publishable-key", value: PUBLISHABLE_KEY }]);
    useScript(`${CDN_URL}/connect.js`, "bolt-connect", "text/javascript", [{ key: "data-publishable-key", value: PUBLISHABLE_KEY }]);
    useScript(`${CDN_URL}/embed-accounts.js`, "bolt-embedded-accounts", "text/javascript", []);


    // Not Used yet
    async function accountExists(email: string) {
        const response = await fetch("https://api-sandbox.bolt.com/v1/account/exists?email=" +
            encodeURIComponent(email));
        const responseAsJson = await response.json();
        console.log(responseAsJson)
        return responseAsJson.has_bolt_account;
    }

    let boltEmbedded, authorizeComponent: any;

    
    async function loadEmbedded() {
        console.log("load embedded");
        boltEmbedded = window.Bolt(PUBLISHABLE_KEY);
        authorizeComponent = boltEmbedded.create("authorization_component",  { style: {position: "right"} });
        await authorizeComponent.mount(".email-div");
        let authorizationResponse = await authorizeComponent.authorize({"email": "dev@bolt.com"});
        console.log(authorizationResponse)
        let accountStore = new AccountStore(authorizationResponse);
        let accountSummary = await accountStore.getAccountSummary();
        console.log(accountSummary)
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
            <div id="email-div" className="email-div" ref={emailRef}>
                <input type="email" placeholder="bolt-user@example.com" required></input>
            </div>
            <button type="button" onClick={loadEmbedded}>Load Embedded</button>
            <p className={styles.token}>Token <strong>{orderId}</strong></p>
            {checkoutSuccessful ? (
                <p className={styles.checkoutSuccessful}>Checkout successful!</p>
            ) : (
                    <div data-tid="instant-bolt-checkout-button">
                        <object data={`${BUTTON_BASE_URL}?publishable_key=${PUBLISHABLE_KEY}`} aria-label={"bolt-checkout-button"}/>
                    </div>
                )
            }
        </div>
    );
}

export default Checkout;
