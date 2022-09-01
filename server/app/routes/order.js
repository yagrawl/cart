import express from 'express';
import fetch from 'node-fetch';
import { v4 as uuid } from 'uuid';

const router = express.Router();

router.post('/create', async (req, res) => {
    const cart = req.body;
    const request = generateBoltOrderRequest(cart);
    const url = `${process.env.BOLT_URL}/v1/merchant/orders`;
    const response = await fetch(url, {
        method: "post",
        body: JSON.stringify(request),
        headers: { 
            "Content-Type": "application/json",
            "X-API-Key": process.env.BOLT_API_KEY,
        }
    });

    const data = await response.json();
    return res.status(200).send({ data });  
});

const generateBoltOrderRequest = cart => {
    let total = 0;

    const request = {};
    request.cart = {};
    request.cart.items = [];

    request.cart.currency = "USD",
    request.cart.order_reference = uuid();
    request.channel = "browser";

    cart.forEach(item => {
        const addItem = {};
        
        addItem.total_amount = item.price * item.quantity;
        addItem.unit_price = item.price;
        addItem.quantity = item.quantity;
        addItem.name = item.title;
        addItem.reference = item.id;
        addItem.image_url = item.image;

        total += addItem.total_amount;
        request.cart.items.push(addItem);
    });

    request.cart.total_amount = total;
    return request;
}

export default router;