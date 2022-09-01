import React, { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import {
    incrementItem,
    decrementItem,
    addItem,
    removeItem,
} from '../reducers/cartSlice';
import { getDisplayAmount } from '../utils/amount';
import styles from './product.module.scss';

interface Props {
    id: string;
    title: string;
    subtitle?: string;
    price: number;
    image: string;
}

export const Product = (props: Props) => {
    const [quantity, setQuantity] = useState(0);
    const dispatch = useAppDispatch();

    const amount = getDisplayAmount(props.price);

    const incrementQuantity = () => {
        setQuantity(quantity + 1);
        if(quantity === 0) {
            dispatch(addItem({
                id: props.id,
                title: props.title,
                subtitle: props.subtitle,
                price: props.price,
                image: props.image,
            }));
        } else {
            dispatch(incrementItem({ id: props.id }));
        }
    }

    const decrementQuantity = () => {
        setQuantity(quantity - 1);
        if(quantity === 1) {
            dispatch(removeItem({ id: props.id }));
        } else {
            dispatch(decrementItem({ id: props.id }));
        }
    }

    const AddToCartButton = () => {
        if(!quantity) {
            return (
                <button className={`${styles.addToCartButton} ${styles.addToCartButtonBase}}`} onClick={incrementQuantity}>+ Add to cart</button>
            )
        } else {
            return (
                <div className={styles.addToCartDiv}>
                    <button className={styles.decrementButton} onClick={decrementQuantity}>
                        {" - "}
                    </button>
                    <span className={styles.quantity}>{quantity}</span>
                    <button className={styles.incrementButton} onClick={incrementQuantity}>{" + "}</button>
                </div>
            )
        }
    }

    return (
        <div className={styles.container}>
            <img className={styles.image} src={props.image} alt={"product visual"}/>
            <div className={styles.details}>
                <p className={styles.price}>
                    {amount.currency}{amount.whole}
                    <sup className={styles.fractional}>{amount.fractional}</sup>
                </p>
                <p className={styles.title}>{props.title} <br/><span className={styles.subtitle}>{props.subtitle}</span></p>
                <AddToCartButton/>
            </div>
        </div>
    )
};
