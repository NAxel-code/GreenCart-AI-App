import { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard';
import { useParams } from 'react-router-dom';

const ProductCategory = () => {
    const { products } = useAppContext();
    const { category } = useParams();

    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        let filtered = products;

        if (category) {
            filtered = filtered.filter(product => {
                const categories = Array.isArray(product.category)
                    ? product.category
                    : typeof product.category === 'string'
                        ? [product.category]
                        : [];

                return categories.some(cat => cat.toLowerCase() === category.toLowerCase())
            })
        }

        setFilteredProducts(filtered);

    }, [products, category]);


    return (
        <div className='mt-16 flex flex-col'>
            <div className="flex flex-col items-end w-max">
                <p className="text-2xl font-medium uppercase">
                    {category ? category : 'All Products'}
                </p>
                <div className="w-12 h-0.5 bg-primary rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
                {filteredProducts.filter((product) => product.inStock).map((product, idx) => (
                    <ProductCard key={idx} product={product} />
                ))}
            </div>
        </div>
    )
}

export default ProductCategory