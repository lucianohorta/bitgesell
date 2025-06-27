import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ItemDetail.module.css';

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItem() {
      const res = await fetch(`http://localhost:3001/items/${id}`);
      const data = await res.json();
      setItem(data);
    }
    fetchItem();
  }, [id]);

  if (!item) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className={styles.card}>
        <h1 className={styles.title}>{item.name}</h1>
        <p className={styles.text}>
          <strong>Category:</strong> {item.category}
        </p>
        <p className={styles.text}>
          <strong>Price:</strong> ${item.price}
        </p>
      </div>
    </div>
  );
}
