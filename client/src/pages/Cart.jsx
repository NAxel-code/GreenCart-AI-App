import { useEffect, useRef, useState } from "react"
import { useAppContext } from "../context/AppContext"
import { assets } from "../assets/assets"
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";

import { LuCircleAlert } from 'react-icons/lu'
import QuestionCard from "../components/Cards/QuestionCard";
import SkeletonLoader from "../components/Loader/SkeletonLoader";
import Drawer from "../components/Drawer";
import AIResponsePreview from "./InterviewPrep/components/AIResponsePreview";
import SpinnerLoader from "../components/Loader/SpinnerLoader";

const Cart = () => {
    const { user, products, currency, cartItems, removeFromCart, getCartCount,
        updateCartItem, navigate, getCartAmount, setCartItems, myOrders } = useAppContext();
    const [cartArray, setCartArray] = useState([])
    const [addresses, setAddresses] = useState([])
    const [showAddress, setShowAddress] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [paymentOption, setPaymentOption] = useState("COD")

    const [errorMsg, setErrorMsg] = useState("");

    const [recipes, setRecipes] = useState(null);
    const [loading, setIsLoading] = useState(false);

    const contentRef = useRef(null);

    const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
    const [explanation, setExplanation] = useState(null);

    const [recipeDescription, setRecipeDescription] = useState("");

    const [enrichedRecipes, setEnrichedRecipes] = useState([]);

    //TO LET THE USER CHOOSE HOW MANY RECIPES THEY WANT
    const [recipeCount, setRecipeCount] = useState(3);

    const getCart = () => {
        let tempArray = []
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key)
            if (product && cartItems[key] > 0) {
                tempArray.push({
                    ...product,
                    quantity: cartItems[key]
                });
            }
        }

        setCartArray(tempArray);
    };

    const getUserAddresses = async () => {
        try {
            const { data } = await axiosInstance.get(`${API_PATHS.ADDRESS.GET_ADDRESS}?userId=${user._id}`);

            if (data?.success) {
                setAddresses(data.addresses);
                if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
            }

            else toast.error(data.message);

        } catch (error) {
            toast.error(error.message);
        }
    }

    const placeOrder = async () => {
        try {
            if (!selectedAddress) return toast.error("Please Select An Address");

            //IF PLACE ORDER IS WITH COD
            if (paymentOption === "COD") {
                const { data } = await axiosInstance.post(API_PATHS.ORDER.ORDER_COD, {
                    userId: user._id,
                    items: cartArray.map((item) => ({
                        product: item._id,
                        quantity: item.quantity
                    })),
                    address: selectedAddress._id
                })

                if (data.success) {
                    toast.success(data.message);
                    setCartItems({});
                    navigate("/my-orders");
                }

                else toast.error(data.message);
            }

            //IF PLACE ORDER IS WITH ONLINE
            else {
                const { data } = await axiosInstance.post(API_PATHS.ORDER.ORDER_ONLINE, {
                    userId: user._id,
                    items: cartArray.map((item) => ({
                        product: item._id,
                        quantity: item.quantity
                    })),
                    address: selectedAddress._id
                })

                if (data.success) window.location.replace(data.url);

                else toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (products.length > 0 && cartItems)
            getCart();

    }, [products, cartItems]);

    useEffect(() => {
        if (user) getUserAddresses();

    }, [user]);

    const formatRecipe = (recipe, rawIngredients) => {
        const steps = recipe.instructions
            .split(/\d+\.\s*/).filter(Boolean)
            .map((step, index) => `${index + 1}. ${step.trim()}`);

        const ingredientsList = Array.isArray(recipe.ingredients)
            ? recipe.ingredients.map((item) =>
                typeof item === "string"
                    ? `- ${item}`
                    : `- ${item.name}${item.weight ? ` (${item.weight})` : ""}`
            )
            : [];

        return {
            title: recipe.title,
            question: recipe.title,
            answer: [
                `**Description:** ${recipe.description}`,
                ``,
                `**Ingredients That Are Needed:**`,
                ...ingredientsList,
                ``,
                `**Instructions On How To Make it Yourself:**`,
                ...steps
            ].join('\n'),
            ingredients: recipe.ingredients,
            rawIngredients
        };
    };

    const formatExplanation = (dataArray) => {
        return dataArray.map((data, index) => {
            return [
                `### Ingredient ${index + 1}. ${data.name}`,
                ``,
                `**Health & Nutrition Benefits:**`,
                `${data.healthBenefits}`,
                ``,
                `**Flavor Profile & Experience:**`,
                `${data.flavorProfile}`,
                ``,
                `**Cultural or Emotional Significance:**`,
                `${data.originStory}`,
                ``,
                `**Perfect For:**`,
                `${data.occasion}`,
                ``,
                `**Quick Tip:**`,
                `${data.tip}`
            ].join('\n');
        }).join('\n\n');
    };

    const handleGenerateRecipes = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            // console.log("cartArray:", cartArray);
            // console.log("cartItems:", cartItems);

            const allProducts = products.map(product => ({
                name: product.name,
                desc: product.description,
                weight: product.weight || "N/A"
            }));

            // console.log(allProducts);

            const recentItems = myOrders.flatMap(order =>
                order.items.map(item => item.name)
            );

            // console.log(recentItems);

            const ingredients = cartArray.map(product => ({
                name: product.name,
                weight: product.weight || "N/A"
            }));

            // THE AI CAN GIVE RECOMMENDATIONS OF DISHES BASED OFF ALL THE ITEMS AVAILABLE IN THE STORE
            // if (ingredients.length === 0) {
            //     toast.error("Your cart is empty. Add items before generating recipes.");
            //     setIsLoading(false);
            //     return;
            // }

            // console.log("Ingredients:", ingredients);

            const { data } = await axiosInstance.post(API_PATHS.AI.GENERATE_RECIPES, {
                numberOfRecipes: recipeCount,
                ingredients,
                allProducts,
                recentItems,
                description: recipeDescription,
            });

            const formattedRecipes = data.map(recipe => formatRecipe(recipe, recipe.ingredients));
            const enriched = await Promise.all(
                formattedRecipes.map(async (recipe) => {
                    const explanationIngredients = Array.isArray(recipe.rawIngredients)
                        ? recipe.rawIngredients.map(ing =>
                            typeof ing === "string"
                                ? { name: ing }
                                : { name: ing.name, weight: ing.weight || "N/A" }
                        )
                        : [];

                    const { data: explanation } = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
                        ingredients: explanationIngredients,
                        dishName: recipe.title

                    });

                    return {
                        ...recipe,
                        explanation
                    };
                })
            );

            setRecipes(enriched);
            setEnrichedRecipes(enriched);

            // console.log("Generated recipes:", data);

            toast.success("Recipes generated successfully!");

        } catch (error) {
            toast.error("Something went wrong while generating recipes.");
            console.error("Failed to generate recipes:", error);

        } finally {
            setIsLoading(false);
        }
    };

    // GENERATE CONCEPT EXPLANATION
    const generateConceptExplanation = async (title) => {
        try {
            setErrorMsg("");
            setExplanation(null);

            setIsLoading(true);
            setOpenLearnMoreDrawer(true);

            const match = enrichedRecipes.find(
                recipe =>
                    recipe?.title?.trim().toLowerCase() === title.trim().toLowerCase() ||
                    recipe?.question?.trim().toLowerCase() === title.trim().toLowerCase()
            );

            console.log("Matched recipe:", match);
            console.log("Explanation:", match?.explanation);

            if (match?.explanation)
                setExplanation(formatExplanation(match.explanation));

            else if (match)
                setErrorMsg("This recipe has no explanation yet.");

            else
                setErrorMsg("No explanation found for this recipe.");

        } catch (error) {
            setExplanation(null);
            setErrorMsg("Failed to generate explanation. Please try again later.");
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return products.length > 0 && cartItems ? (
        <div>
            <div className="flex flex-col md:flex-row mt-16">
                <div className='flex-1 max-w-4xl'>
                    <h1 className="text-3xl font-medium mb-6">
                        Shopping Cart
                        <br />
                        <span className="text-sm text-primary">{getCartCount()} Items</span>
                    </h1>

                    <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                        <p className="text-left">Product Details</p>
                        <p className="text-center">Subtotal</p>
                        <p className="text-center">Action</p>
                    </div>

                    {cartArray.map((product, index) => (
                        <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                            <div className="flex items-center md:gap-6 gap-3">
                                <div onClick={() => {
                                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0)
                                }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                                    <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                                </div>
                                <div>
                                    <p className="hidden md:block font-semibold">{product.name}</p>
                                    <div className="font-normal text-gray-500/70">
                                        <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                        <div className='flex items-center'>
                                            <p>Qty:</p>
                                            <select onChange={e => updateCartItem(product._id, Number(e.target.value))} value={cartItems[product._id]} className='outline-none'>
                                                {Array(cartItems[product._id] > 9 ? cartItems[product._id] : 9).fill('').map((_, index) => (
                                                    <option key={index} value={index + 1}>{index + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
                            <button onClick={() => removeFromCart(product._id)} className="cursor-pointer mx-auto">
                                <img src={assets.remove_icon} alt="remove" className="inline-block w-6 h-6" />
                            </button>
                        </div>)
                    )}

                    <button onClick={() => { navigate("/products"); scrollTo(0, 0) }} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                        <img className="group-hover:-translate-x-1 transition" src={assets.arrow_right_icon_colored} alt="arrow" />
                        Continue Shopping
                    </button>

                </div>

                <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                    <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                    <hr className="border-gray-300 my-5" />

                    <div className="mb-6">
                        <p className="text-sm font-medium uppercase">Delivery Address</p>
                        <div className="relative flex justify-between items-start mt-2">
                            <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city},
                        ${selectedAddress.state}, ${selectedAddress.country}` : "No address found"}</p>
                            <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                                Change
                            </button>
                            {showAddress && (
                                <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                    {addresses.map((address, index) => (
                                        <p
                                            key={address._id || index} // Prefer a stable unique ID if available
                                            onClick={() => {
                                                setSelectedAddress(address);
                                                setShowAddress(false);
                                            }}
                                            className="text-gray-500 p-2 hover:bg-gray-100"
                                        >
                                            {address.street}, {address.city}, {address.state}, {address.country}
                                        </p>
                                    ))}
                                    <p onClick={() => navigate("/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10">
                                        Add address
                                    </p>
                                </div>
                            )}
                        </div>

                        <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                        <select className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
                            value={paymentOption}
                            onChange={(e) => setPaymentOption(e.target.value)}
                        >
                            <option value="COD">Cash On Delivery</option>
                            <option value="Online">Online Payment</option>
                        </select>
                    </div>

                    <hr className="border-gray-300" />

                    <div className="text-gray-500 mt-4 space-y-2">
                        <p className="flex justify-between">
                            <span>Price</span><span>{currency}{getCartAmount()}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Shipping Fee</span><span className="text-green-600">Free</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Tax (2%)</span><span>{currency}{Math.round((getCartAmount() * 2 / 100) * 100) / 100}</span>
                        </p>
                        <p className="flex justify-between text-lg font-medium mt-3">
                            <span>Total Amount:</span><span>{currency}{Math.round((getCartAmount() + getCartAmount() * 2 / 100) * 100) / 100}</span>
                        </p>
                    </div>

                    <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary transition">
                        {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
                    </button>
                </div>

            </div>

            <div ref={contentRef} className="mt-4 text-gray-700 bg-gray-50 px-5 py-3 rounded-lg">
                <div className="flex flex-col items-center gap-4 mt-5">
                    <label className="text-sm font-medium text-gray-700">
                        How many recipes would you like?
                    </label>

                    <input
                        type="number"
                        min={1}
                        max={10}
                        value={recipeCount}
                        onChange={(e) => setRecipeCount(Number(e.target.value))}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md text-center text-lg"
                    />

                    <label className="text-sm font-medium text-gray-700">
                        Describe what kind of recipes you're looking for:
                    </label>
                    <textarea
                        value={recipeDescription}
                        onChange={(e) => setRecipeDescription(e.target.value)}
                        rows={3}
                        placeholder="e.g., vegetarian meals with tofu and mushrooms"
                        className="w-xl px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />

                    <button
                        type="button"
                        onClick={(e) => {
                            handleGenerateRecipes(e);
                            // handleGenerateRecipes(e, recipeDescription);
                        }}
                        className="py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary transition px-4 md:px-6 md:py-3 md:text-base lg:px-10 lg:py-4 lg:text-md"
                        disabled={loading}
                    >
                        {loading ? <SpinnerLoader /> : "Generate Recipes"}
                    </button>
                </div>

                <div className="mt-6">
                    {Array.isArray(recipes) && recipes.length > 0 && recipes.map((r, index) => (
                        <QuestionCard
                            key={index}
                            question={r.question}
                            answer={r.answer}
                            onLearnMore={() =>
                                generateConceptExplanation(r.question, cartArray.map(p => ({
                                    name: p.name,
                                    weight: p.weight || "N/A"
                                })))
                            }
                        />
                    ))}
                </div>
            </div>

            <div>
                <Drawer
                    isOpen={openLearnMoreDrawer}
                    onClose={() => setOpenLearnMoreDrawer(false)}
                    title={!loading && explanation?.title}
                >
                    {errorMsg && (
                        <p className="flex gap-2 text-sm text-amber-600 font-medium">
                            <LuCircleAlert className='mt-1' /> {errorMsg}
                        </p>
                    )}

                    {loading && <SkeletonLoader />}

                    {!loading && explanation && (
                        <AIResponsePreview content={explanation} />
                    )}

                    {!loading && !explanation && (
                        <p className="text-sm text-gray-500">No explanation available.</p>
                    )}
                </Drawer>
            </div>
        </div >
    ) : null
}

export default Cart