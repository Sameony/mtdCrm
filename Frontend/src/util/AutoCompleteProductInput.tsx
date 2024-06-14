import React, { useState, useEffect, useRef } from 'react';
import { orderApis } from '../config/orderApi';

interface Size {
    L: number;
    W: number;
    H: number;
}

interface Child {
    SKU: string;
    name: string;
    color: string;
    selling_price: number;
    sale_price: number;
    cost_price: number;
    product_size: Size;
    shipping_size: Size;
    weight: number;
    status: string;
}

interface Product {
    _id: string;
    name: string;
    category: string;
    ID: string;
    children: Child[];
}

const AutocompleteProductInput: React.FC<{ value: string, onChange: (product: Child & { parentName: string }) => void }> = ({ value, onChange }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<(Child & { parentName: string })[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {


        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await orderApis.getAllProducts();
            // console.log(response)
            const data: Product[] = response.data.data
            setProducts(data);
            setFilteredProducts(data.flatMap(product => product.children.map(child => ({ ...child, parentName: product.name }))));
        } catch (error) {
            console.log(error)
        }
       
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setShowDropdown(true);

        const filtered = products.flatMap(product =>
            product.children.filter(child =>
                `${product.name} ${child.name}`.toLowerCase().includes(query)
            ).map(child => ({ ...child, parentName: product.name }))
        );

        setFilteredProducts(filtered);
    };

    const handleProductSelect = (product: Child & { parentName: string }) => {
        onChange(product);
        setShowDropdown(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(true)}
                placeholder="Type to search product"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
            />
            {showDropdown && filteredProducts.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {filteredProducts.map(product => (
                        <li
                            key={product.SKU}
                            onClick={() => handleProductSelect(product)}
                            className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                        >
                            {product.parentName} {product.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteProductInput;