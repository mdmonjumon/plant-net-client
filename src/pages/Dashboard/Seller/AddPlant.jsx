import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../utils';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { axiosSecure } from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';

const AddPlant = () => {
  const { user } = useAuth();
  const [addImgButton, setAddImgButton] = useState({ name: 'Upload Image' });
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()


  const handleAddPlants = async (e) => {
    e.preventDefault();
    setLoading(true)
    const form = e.target;
    const name = form.name.value;
    const description = form.description.value;
    const category = form.category.value;
    const price = parseFloat(form.price.value);
    const quantity = parseInt(form.quantity.value);
    const image = form.image.files[0];
    const imageUrl = await imageUpload(image);

    // seller info
    const seller = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email,
    }


    const plantsInfo = {
      name,
      description,
      category,
      price,
      quantity,
      image: imageUrl,
      seller
    }


    // const result = await axios.post(`${import.meta.env.VITE_API_URL}/plants`, plantsInfo);
    // if(result.data.insertedId){
    //   toast.success(`${name} added`)
    // }

    try {
      const result = await axiosSecure.post(`/plants`, plantsInfo);
      if (result.data.insertedId) {
        toast.success(`${name} added`)
        form.reset();
        setAddImgButton({ ...addImgButton, image: null })
        navigate('/dashboard/my-inventory')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm handleAddPlants={handleAddPlants}
        addImgButton={addImgButton}
        setAddImgButton={setAddImgButton}
        loading={loading}
      />
    </div>
  )
}

export default AddPlant
