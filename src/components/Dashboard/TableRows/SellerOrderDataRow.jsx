import PropTypes from 'prop-types'
import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'


const SellerOrderDataRow = ({ orderData, refetch }) => {
  const axiosSecure = useAxiosSecure()
  let [isOpen, setIsOpen] = useState(false)
  const closeModal = () => setIsOpen(false)
  const { name, customer: { email }, price, quantity, status, address, _id, plantId } = orderData;



  const handleCancelButton = async () => {
    try {
      await axiosSecure.delete(`/orders/${_id}`)
      await axiosSecure.patch(`/plants/quantity/${plantId}`, { quantityToUpdate: quantity, status: "increase" });
      toast.success("Order Cancellation Success")
      refetch()
    }
    catch (error) {
      console.log(error)
      toast.error(error.response.data)
    }
    finally {
      closeModal()
    }
  }


  const handleChangeStatus = async (updateStatus) => {
    if (status.toLowerCase() === updateStatus.toLowerCase()) return toast.error(`Your current status is ${updateStatus}! You cannot set it again`);
    // send request to the server to update the status
    try {
      // fetch request
      await axiosSecure.patch(`/order/status/${_id}`, { status: updateStatus });
      toast.success(`Status update to ${updateStatus}`);
      refetch()
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data)
    }
  }

  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{name}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{email}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>${price}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{quantity}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{address}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{status}</p>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center gap-2'>
          <select
            onChange={(e) => handleChangeStatus(e.target.value)}
            defaultValue={status}
            required
            className='p-1 border-2 border-lime-300 focus:outline-lime-500 rounded-md text-gray-900 whitespace-no-wrap bg-white'
            name='category'
            disabled={status.toLowerCase() === "delivered"}
          >
            <option value='Pending'>Pending</option>
            <option value='In Progress'>Start Processing</option>
            <option value='Delivered'>Deliver</option>
          </select>
          <button
            onClick={() => setIsOpen(true)}
            className='relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
          >
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-red-200 opacity-50 rounded-full'
            ></span>
            <span className='relative'>Cancel</span>
          </button>
        </div>
        <DeleteModal isOpen={isOpen} closeModal={closeModal} handleDelete={handleCancelButton} />
      </td>
    </tr>
  )
}

SellerOrderDataRow.propTypes = {
  orderData: PropTypes.object,
  refetch: PropTypes.func,
}

export default SellerOrderDataRow
