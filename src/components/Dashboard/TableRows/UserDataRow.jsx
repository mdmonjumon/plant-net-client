import { useState } from 'react'
import UpdateUserModal from '../../Modal/UpdateUserModal'
import PropTypes from 'prop-types'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
const UserDataRow = ({ userData, refetch }) => {
  const [isOpen, setIsOpen] = useState(false)
  const axiosSecure = useAxiosSecure();
  const { email, role, status } = userData;

  const handleUpdateRole = async (updateRole) => {
    if (updateRole.toLowerCase() === role.toLowerCase()) {
      return toast.error(`This user already have ${updateRole} role`)
    }

    try {
      // sent request to server for update user role
      const { data } = await axiosSecure.patch(`/user/role/${email}`, { role: updateRole })
      if (data.modifiedCount > 0) {
        toast.success(`Role updated to ${updateRole}`)
        refetch();
      }
    } catch (error) {
      console.log(error?.response?.data);

    }
    finally {
      setIsOpen(false)
    }
  }

  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{email}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 whitespace-no-wrap'>{role}</p>
      </td>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        {
          status ?
            <p className={`${status === "Requested" ? "text-yellow-500" : "text-green-500"} whitespace-no-wrap`}>{status}</p>
            :
            <p className='text-red-500 whitespace-no-wrap'>Unavailable</p>
        }
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <span
          onClick={() => setIsOpen(true)}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-green-200 opacity-50 rounded-full'
          ></span>
          <span className='relative'>Update Role</span>
        </span>
        {/* Modal */}
        <UpdateUserModal isOpen={isOpen} setIsOpen={setIsOpen} handleUpdateRole={handleUpdateRole} role={role} />
      </td>
    </tr>
  )
}

UserDataRow.propTypes = {
  userData: PropTypes.object,
  refetch: PropTypes.func,

}

export default UserDataRow
