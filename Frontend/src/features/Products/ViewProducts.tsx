import React, { useEffect, useState } from 'react';
import { orderApis } from '../../config/orderApi';
import { MdEdit, MdImageNotSupported } from 'react-icons/md';
import { Select, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../util/Loading';
import { toast } from 'react-toastify';
import { apiUrl } from '../../config/api/apiUrl';
import { Child } from '../../config/models/Child';

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
        setLoading(true);
        try {
            const response = await orderApis.getAllProducts(); // Adjust the endpoint as necessary
            if (response.data.status) {
                setProducts(response.data.data);
                setFilteredProducts(response.data.data);
                const categorySet = new Set<string>();
                response.data.data.forEach((product: Product) => {
                    categorySet.add(product.category);
                });
                setCategories(categorySet);
            } else {
                toast.error(response.data.err);
                setError('Failed to fetch products');
            }
        } catch (err: any) {
            toast.error(err.response.data.err ?? "");
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
                    return product;
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

    const handleEdit = (productId: string) => {
        navigate(`/products/${productId}/edit`);
    };

    if (loading) return <Loading />;
    if (error) return <div>{error}</div>;

    return (
        <div className="mx-auto p-4 lg:px-8">
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
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    product.children.map(child => (
                        <div key={child.SKU} className="border border-gray-300 rounded-lg shadow-md bg-white p-4 flex flex-col items-center justify-between">
                            <div>
                                <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden mb-4">
                                    {child.image
                                        ? <img src={`${apiUrl.base}/${child.image.path}`} alt={child.name} className="object-contain w-full h-full" />
                                        : <MdImageNotSupported className="text-gray-400 text-6xl" />}
                                </div>
                                <div>
                                    <h5 className="text-lg font-bold text-gray-600 text-center mb-2">{product.name} - {child.name}</h5>
                                    <h6 className="text-sm text-gray-600 text-center mb-4">{product.category}</h6>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2 mb-4 w-full">
                                <p className="text-gray-600"><span className="font-medium">SKU:</span> {child.SKU}</p>
                                <p className="text-gray-600"><span className="font-medium">Color:</span> {child.color}</p>
                                <p className="text-gray-600"><span className="font-medium">Selling Price:</span> ${child.selling_price}</p>
                                <p className="text-gray-600"><span className="font-medium">Sale Price:</span> ${child.sale_price}</p>
                                <p className="text-gray-600"><span className="font-medium">Cost Price:</span> ${child.cost_price}</p>
                                {child.product_size ? <p className="text-gray-600"><span className="font-medium">Product Size:</span> L: {child.product_size?.L}, W: {child.product_size?.W}, H: {child.product_size?.H}</p> : <></>}
                                {child.shipping_size ? <p className="text-gray-600"><span className="font-medium">Shipping Size:</span> L: {child.shipping_size?.L}, W: {child.shipping_size?.W}, H: {child.shipping_size?.H}</p> : <></>}
                                {child.weight && <p className="text-gray-600"><span className="font-medium">Weight:</span> {child.weight} kg</p>}
                                <p className="text-gray-600"><span className="font-medium">Status:</span> {child.status}</p>
                            </div>
                            <button
                                onClick={() => handleEdit(product._id)}
                                className="bg-indigo-500 w-full text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200 flex items-center justify-center"
                            >
                                <MdEdit className="mr-2" /> Edit
                            </button>
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
};

export default ViewProducts;
