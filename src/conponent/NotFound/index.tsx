import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function NotFound() {
  const url = useLocation();
  const [we, setWe] = useState(404);
  console.log(url);
  useEffect(() => {
    if (url.pathname === '1') {
      console.log(333);
    }
  }, []);
  return <div>{we}</div>;
}
