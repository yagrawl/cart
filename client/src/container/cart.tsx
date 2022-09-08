import React from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectCart } from '../reducers/cartSlice';
import { changeStep } from '../reducers/flowSlice';
import { getDisplayAmount } from '../utils/amount';
import emptyCartImage from '../assets/images/emptyCart.png';
import styles from './cart.module.scss';
import { createOrder } from '../requests/order';

const Cart = () => {
    const dispatch = useAppDispatch();
    const cart = useAppSelector(selectCart);
    const renderCart = () => {
        const items = cart.map(item => {
            const itemTotal = getDisplayAmount(item.price * item.quantity);
            const displayPrice = getDisplayAmount(item.price);
            return (
                <div className={styles.cartItemContainer} key={item.id}>
                    <img className={styles.cartItemImage} src={item.image} alt={"product visual"}/>
                    <p className={styles.cartItemDetails}>
                        <span className={styles.cartItemTitle}>{item.title}</span>
                        <br/>
                        <span className={styles.cartItemCalculations}>
                            <span className={styles.cartItemTotal}>{`${itemTotal.currency}${itemTotal.whole}.${itemTotal.fractional}`}</span>
                            &nbsp;
                            ({`${displayPrice.currency}${displayPrice.whole}.${displayPrice.fractional}`} x {item.quantity})
                        </span>
                    </p>
                    <div className={styles.clear}></div>
                </div>
            )
        });

        if(items.length === 0) {
            return (
                <div className={styles.emptyCartContainer}>
                    <img src={emptyCartImage} className={styles.emptyCartImage} alt={"empty cart"}/>
                    <p className={styles.emptyCartText}>Your cart is empty. Add items to get started.</p>
                </div>
            );
        }

        return items;
    }

    const renderCheckout = async () => {
        const order = await createOrder(cart);
        dispatch(changeStep({ step: "checkout", orderId: order.token }));
    }

    const calculateTotal = () => {
        let total = 0;
        cart.forEach(item => total += (item.price * item.quantity));
        const cartTotal = getDisplayAmount(total);

        return total ? (
            <div>
                <p>Total&nbsp; 
                    <span className={styles.cartTotal}>
                        {`${cartTotal.currency}${cartTotal.whole}.${cartTotal.fractional}`}
                    </span>
                </p>
                <button className={styles.seeMyCartButton} onClick={renderCheckout}>See my cart</button>
            </div>
        ) : null;
    }

    return (
        <div>
            {renderCart()}
            {calculateTotal()}
        </div>
    );
}

export default Cart;