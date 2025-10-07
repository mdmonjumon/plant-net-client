import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import Button from "../Shared/Button/Button";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";


const CheckoutForm = ({ totalPrice, handlePurchase, totalQuantity, id }) => {
    const [error, setError] = useState('')
    const [paymentSecret, setPaymentSecret] = useState(null)
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure()
    const { user } = useAuth()

    useEffect(() => {
        axiosSecure.post('/create-payment-intent', { totalQuantity, id })
            .then(res => setPaymentSecret(res?.data?.clientSecret))
    }, [totalQuantity])





    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            setError(error.message)
            return;
        } else {
            setError('')
            console.log('[PaymentMethod]', paymentMethod);
        }


        // confirm card payment
        const { paymentIntent, error: paymentError } = await stripe.confirmCardPayment(paymentSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: user.displayName || "anonymous",
                    email: user?.email || "anonymous",
                },
            },
        })

        if (paymentError) {
            setError(paymentError?.message)
        }
        else {
            if (paymentIntent.status === "succeeded") {
                setError('')
                handlePurchase(paymentIntent?.id)
            }
        }

    };


    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />
            {/* <button type="submit" disabled={!stripe}>
                Pay
            </button> */}

            <div>
                <Button type="submit" label={`pay ${totalPrice}$`} disabled={!stripe} ></Button>
            </div>
            <div>
                <p className="text-rose-500">
                    {error}
                </p>
            </div>
        </form>
    );
};

CheckoutForm.propTypes = {
    totalPrice: PropTypes.number,
    totalQuantity: PropTypes.number,
    id: PropTypes.string,
    handlePurchase: PropTypes.func,
}

export default CheckoutForm;