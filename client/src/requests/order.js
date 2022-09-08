export const createOrder = async (cart) => {
    const url = new URL('http://localhost:3333/api/order/create');
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart)
    });

    if(response.status !== 200) {
        return 'ERROR';
    }

    const data = await response.json();
    return data;
}