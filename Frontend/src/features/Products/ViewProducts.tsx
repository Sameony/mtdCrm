import React, { useEffect, useState } from 'react';
import { orderApis } from '../../config/orderApi';
import { MdEdit } from 'react-icons/md';
import { Select, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../util/Loading';
import { toast } from 'react-toastify';

interface Size {
    L?: number;
    W?: number;
    H?: number;
}

interface Child {
    SKU: string;
    name: string;
    color: string;
    selling_price: number;
    sale_price: number;
    cost_price: number;
    product_size?: Size;
    shipping_size?: Size;
    weight?: number;
    status: string;
}

interface Product {
    _id: string;
    name: string;
    category: string;
    ID: string;
    children: Child[];
}

const ViewProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [categories, setCategories] = useState<Set<string>>(new Set());

    const navigate = useNavigate()

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, selectedCategory, products]);

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const response = await orderApis.getAllProducts() // Adjust the endpoint as necessary
            if (response.data.status) {
                setProducts(response.data.data);
                setFilteredProducts(response.data.data);
                const categorySet = new Set<string>();
                response.data.data.forEach((product: Product) => {
                    categorySet.add(product.category);
                });
                setCategories(categorySet);
            } else {
                toast.error(response.data.err)
                setError('Failed to fetch products');
            }
        } catch (err:any) {
            toast.error(err.response.data.err??"")
            setError('Error fetching products');
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = products;

        if (searchTerm !== '') {
            filtered = filtered.map(product => {
                if (product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    return product
                const matchingChildren = product.children.filter(child =>
                    child.SKU.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    child.name.toLowerCase().includes(searchTerm.toLowerCase())
                );

                if (matchingChildren.length > 0) {
                    return { ...product, children: matchingChildren };
                } else {
                    return null;
                }
            }).filter(product => product !== null) as Product[];
        }

        if (selectedCategory !== '') {
            filtered = filtered.filter(product =>
                product.category === selectedCategory
            );
        }

        setFilteredProducts(filtered);
    };

    const handleEdit = (productId:string) => {
        navigate(`/products/${productId}/edit`);
    };

    if (loading) return <Loading />
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl text-gray-800 font-semibold mb-8">Products Listing</h2>
            <div className='flex gap-6 justify-between items-center'>
                <TextInput
                    type="text"
                    placeholder="Search by name or SKU"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
                <Select value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)} >
                    <option value="">All Categories</option>
                    {[...categories].map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </Select>
            </div>
            {/* wide screen wide card display */}
            <div className="container mx-auto px-4 py-8">
            {filteredProducts.map(product => (
                product.children.map(child => (
                    <div key={child.SKU} className="mb-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col md:flex-row items-center">
                        <div className="flex-grow p-4 px-6">
                            <div className="flex flex-col justify-between mb-4">
                                <h5 className="text-lg font-bold text-gray-600">{product.name} - {child.name}</h5>
                                <h6 className="text-sm text-gray-600">{product.category}</h6>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                <p className="text-gray-600"><span className="font-medium">SKU:</span> <span className='font-thin'>{child.SKU}</span></p>
                                <p className="text-gray-600"><span className="font-medium">Color:</span> <span className='font-thin'>{child.color}</span></p>
                                <p className="text-gray-600"><span className="font-medium">Selling Price:</span> <span className='font-thin'>${child.selling_price}</span></p>
                                <p className="text-gray-600"><span className="font-medium">Sale Price:</span> <span className='font-thin'>${child.sale_price}</span></p>
                                <p className="text-gray-600"><span className="font-medium">Cost Price:</span> <span className='font-thin'>${child.cost_price}</span></p>
                                <p className="text-gray-600"><span className="font-medium">Product Size:</span> <span className='font-thin'>L: {child.product_size?.L}, W: {child.product_size?.W}, H: {child.product_size?.H}</span></p>
                                <p className="text-gray-600"><span className="font-medium">Shipping Size:</span> <span className='font-thin'>L: {child.shipping_size?.L}, W: {child.shipping_size?.W}, H: {child.shipping_size?.H}</span></p>
                                {child.weight?<p className="text-gray-600"><span className="font-medium">Weight:</span> <span className='font-thin'>{child.weight} kg</span></p>:<></>}
                                <p className="text-gray-600"><span className="font-medium">Status:</span> <span className='font-thin'>{child.status}</span></p>
                            </div>
                            <div className="flex justify-end">
                                <button 
                                    onClick={() => handleEdit(product._id)} 
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
                                >
                                    <MdEdit className="mr-2" /> Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ))}
        </div>
          
        </div>
    );
};

export default ViewProducts;
