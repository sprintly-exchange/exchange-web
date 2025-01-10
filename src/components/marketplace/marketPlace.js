import React, { useState } from 'react';
const Marketplace = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', image: '' });
    const [orders, setOrders] = useState([]);

    const handleAddItem = () => {
        if (newItem.name.trim() && newItem.image.trim()) {
            setItems([...items, newItem]);
            setNewItem({ name: '', image: '' });
        }
    };

    const handleOrderItem = (item) => {
        setOrders([...orders, item]);
    };

    return (
        <div>
            <h1>Marketplace</h1>
            <div>
                <h2>Supplier</h2>
                <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Enter item name"
                />
                <input
                    type="text"
                    value={newItem.image}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    placeholder="Enter image URL"
                />
                <button onClick={handleAddItem}>Add Item</button>
            </div>
            <div>
                <h2>Items</h2>
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            <img src={item.image} alt={item.name} width="50" height="50" />
                            {item.name} <button onClick={() => handleOrderItem(item)}>Order</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Buyer</h2>
                <h3>Orders</h3>
                <ul>
                    {orders.map((order, index) => (
                        <li key={index}>
                            <img src={order.image} alt={order.name} width="50" height="50" />
                            {order.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Marketplace;
