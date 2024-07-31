// src/_customHook/useLoader.js
import {useState} from 'react';
import {Loader} from '../components';

const useLoader = () => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  const LoaderComponent = <Loader visible={loading} />;

  return [showLoader, hideLoader, LoaderComponent];
};

export default useLoader;
