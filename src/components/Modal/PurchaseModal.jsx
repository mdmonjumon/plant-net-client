/* eslint-disable react/prop-types */
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Fragment, useRef, useState } from 'react'
import useAuth from '../../hooks/useAuth';
import Button from '../Shared/Button/Button';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const PurchaseModal = ({ closeModal, isOpen, plant, refetch }) => {

  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const { _id, name, category, price, quantity, seller } = plant;
  const [totalQuantity, setTotalQuantity] = useState(1)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [totalPrice, setTotalPrice] = useState(price)
  const quantityValue = useRef()


  // Quantity validation
  const handleQuantityValidation = value => {
    if (!value) {
      if (value < 1) {
        toast.error('Quantity cannot be less then 1')
        setTotalQuantity(1)
        return
      }
      setTotalQuantity('')
      setTotalPrice(0)
      return
    }

    if (value) {
      if (value > quantity) {
        toast.error(`You cannot select grater then available quantity. Available quantity : ${quantity}`)
        setTotalQuantity(quantity)
        setTotalPrice(price * quantity)
        return
      }
      setTotalQuantity(value)
      setTotalPrice(price * value)
    }
  }


  const handlePurchase = async () => {

    if (!totalQuantity || !deliveryAddress) {
      return toast.error(`${!totalQuantity && "Quantity" || !deliveryAddress && "Address"} cannot be empty`)
    }

    const orderInfo = {
      customer: {
        name: user?.displayName,
        email: user?.email,
        image: user?.photoURL
      },
      plantId: _id,
      price: totalPrice,
      quantity: totalQuantity,
      sellerEmail: seller?.email,
      address: deliveryAddress,
      status: "pending"
    }

    try {
      await axiosSecure.post('/order', orderInfo);
      await axiosSecure.patch(`/plants/quantity/${_id}`, {quantityToUpdate:totalQuantity, status:"decrease"});
      refetch()
      toast.success('Order Successful');
    } catch (error) {
      console.log(error);

    }
    finally {
      closeModal()
    }
  }


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                  as='h3'
                  className='text-lg font-medium text-center leading-6 text-gray-900'
                >
                  Review Info Before Purchase
                </DialogTitle>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Plant: {name}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Category: {category}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Customer: {user?.displayName}</p>
                </div>

                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Price: $ {price}</p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Available Quantity: {quantity}</p>
                </div>

                {/* Quantity */}
                <div className='space-x-2 text-sm mb-3'>
                  <label htmlFor='quantity' className='text-gray-600'>
                    Quantity:
                  </label>
                  <input
                    className='p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                    onChange={(e) => handleQuantityValidation(parseInt(e.target.value))}
                    value={totalQuantity}
                    name='quantity'
                    id='quantity'
                    type='number'
                    placeholder='Available quantity'
                    required
                    ref={quantityValue}
                  />
                </div>
                {/* Address */}
                <div className='space-x-2 text-sm mb-3'>
                  <label htmlFor='quantity' className='text-gray-600'>
                    Address:
                  </label>
                  <input
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    value={deliveryAddress}
                    className='p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                    name='address'
                    id='address'
                    type='text'
                    placeholder='Write your address'
                    required
                  />
                </div>

                <Button onClick={handlePurchase} label={`pay ${totalPrice}$`} ></Button>


              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PurchaseModal
