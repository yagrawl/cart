import React, { useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectOrderId } from '../reducers/flowSlice';
import useScript from '../utils/hooks/useScript';
import styles from './checkout.module.scss';

const CDN_URL = "https://connect-sandbox.bolt.com";
const PUBLISHABLE_KEY = "XRHslcMVq0Rf.D7GlPTeIRKUm.79646402d4ea75b6b89c35464905e9282be26340f9fa3cfaa157df3f356e67a1";
const BUTTON_BASE_URL = "https://connect-sandbox.bolt.com/v1/checkout_button";

const Checkout = () => {
    const orderId = useAppSelector(selectOrderId);
    const [checkoutSuccessful, setCheckoutSuccessful] = useState(false);

    useScript(`${CDN_URL}/track.js`, "bolt-track", "text/javascript", [{ key: "data-publishable-key", value: PUBLISHABLE_KEY }]);
    useScript(`${CDN_URL}/connect.js`, "bolt-connect", "text/javascript", [{ key: "data-publishable-key", value: PUBLISHABLE_KEY }]);

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
