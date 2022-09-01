import React from 'react';
import { useAppSelector } from '../app/hooks';
import { selectCart } from '../reducers/cartSlice';
import { getDisplayAmount } from '../utils/amount';
import styles from './cart.module.scss';

const Cart = () => {
    const cart = useAppSelector(selectCart);
    const renderCart = () => {
        const items = cart.map(item => {
            const itemTotal = getDisplayAmount(item.price * item.quantity);
            const displayPrice = getDisplayAmount(item.price);
            return (
                <div className={styles.cartItemContainer}>
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

        return items;
    }

    const calculateTotal = () => {
        let total = 0;
        cart.forEach(item => total += (item.price * item.quantity));
        const cartTotal = getDisplayAmount(total);

        return total ? (
            <p>Total&nbsp; 
                <span className={styles.cartTotal}>
                    {`${cartTotal.currency}${cartTotal.whole}.${cartTotal.fractional}`}
                </span>
            </p>
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