import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'
import UpdatePlantModal from '../../Modal/UpdatePlantModal'
import PropTypes from 'prop-types'

import toast from 'react-hot-toast'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const PlantDataRow = ({ plant, refetch }) => {
  const axiosSecure = useAxiosSecure()
  let [isOpen, setIsOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }
  const { name, image, category, price, quantity, _id } = plant;

  const handleDeletePlant = async () => {
    try {
      await axiosSecure.delete(`/delete/plant/seller/${_id}`)
      toast.success(`${name} Successfully Deleted`)
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data)
    }
    finally {
      refetch();
      closeModal();
    }

  }

  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <div className='block relative'>
              <img
                alt='profile'
                src={image}
                className='mx-auto object-cover rounded h-10 w-15 '
              />
            </div>
          </div>
        </div>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{name}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{category}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>${price}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{quantity}</p>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <span
          onClick={openModal}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-red-200 opacity-50 rounded-full'
          ></span>
          <span className='relative'>Delete</span>
        </span>
        <DeleteModal isOpen={isOpen} closeModal={closeModal} handleDeletePlant={handleDeletePlant} />
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <span
          onClick={() => setIsEditModalOpen(true)}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-green-200 opacity-50 rounded-full'
          ></span>
          <span className='relative'>Update</span>
        </span>
        <UpdatePlantModal
          isOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
        />
      </td>
    </tr>
  )
}

PlantDataRow.propTypes = {
  plant: PropTypes.object,
  refetch: PropTypes.func,
}
export default PlantDataRow
