import { useState } from 'react';

const useForm = options => {
  const [data, setData] = useState(options.initialValues || {});

  const handleOnChange = key => e => {
    setData({
      ...data,
      [key]: e.target.value
    })
  }

  return [
    data,
    handleOnChange
  ]
}

export default useForm;
