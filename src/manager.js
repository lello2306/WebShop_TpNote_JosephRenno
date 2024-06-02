import axios from 'axios';

class Product {
    constructor(id = "", name = "", desc = "", price = 0) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.price = price;
    }
}

class Stock {
    constructor() {
        this.list_product = [];
        this.init();
    }

    async init() {
        try {
            const response = await axios.get('http://localhost:5000/products');
            this.list_product = response.data.map(product => new Product(product.id, product.name, product.description, product.price));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    get_list_product() {
        return this.list_product;
    }

    get_prod_by_id(id) {
		const parsedId = parseInt(id); 
		return this.list_product.find(product => product.id === parsedId) || null;
	}
	
	
}

class Cart {
    constructor() {
        this.list_cart = {};
    }

    get_list_cart() {
        return this.list_cart;
    }

    addInCart(id) {
        if (this.list_cart[id]) {
            this.list_cart[id]++;
        } else {
            this.list_cart[id] = 1;
        }
    }

    removeFromCart(id) {
        if (this.list_cart[id]) {
            if (this.list_cart[id] === 1) {
                delete this.list_cart[id];
            } else {
                this.list_cart[id]--;
            }
        }
    }

    get_nbr_product() {
        return Object.values(this.list_cart).reduce((acc, qty) => acc + qty, 0);
    }

    get_total_price(stk) {
        return Object.entries(this.list_cart).reduce((acc, [id, qty]) => {
            const product = stk.get_prod_by_id(parseInt(id));
            return acc + (product ? product.price * qty : 0);
        }, 0);
    }
}

export { Product, Stock, Cart };
