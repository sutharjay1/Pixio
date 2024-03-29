import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRandomImages } from '../store/imageSlice.js';
import Shimmer from '../Components/Shimmer/Shimmer.jsx';

const useGetRandomImage = () => {
  const dispatch = useDispatch();
  const randomImages = useSelector((store) => store?.image?.randomImages);
  const pageNumber = useSelector((store) => store?.searchQuery?.pageNumber);

  const multipleClientId = [
    import.meta.env.VITE_API_ONE,
    import.meta.env.VITE_API_TWO,
    import.meta.env.VITE_API_THREE,
    import.meta.env.VITE_API_FOUR,
    import.meta.env.VITE_API_FIVE,
  ];

  let clientId =
    multipleClientId[Math.floor(Math.random() * multipleClientId.length)];

  const getRandomImage = async () => {
    try {
      const data = await axios.get(
        `https://api.unsplash.com/photos/random?client_id=${clientId}&count=20&per_page=20&page=${pageNumber}`
      );
      const newResult = data?.data;

      dispatch(setRandomImages([...randomImages, ...newResult]));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const index = multipleClientId.indexOf(clientId);
        clientId = multipleClientId[(index + 1) % multipleClientId.length];
        await getRandomImage();
      }
    }
  };

  useEffect(() => {
    getRandomImage();
  }, [pageNumber]);
};

export default useGetRandomImage;
