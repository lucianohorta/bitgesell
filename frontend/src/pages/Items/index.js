import { useEffect, useState, useCallback } from 'react';
import { useData } from '../../state/DataContext';
import styles from './Items.module.css';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FixedSizeList as List } from 'react-window';
import debounce from 'lodash.debounce';

export default function Items() {
  const {
    items,
    setItems,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    total,
    setTotal,
    limit,
    loading,
    setLoading
  } = useData();

  const [inputTerm, setInputTerm] = useState(searchTerm);
  const totalPages = Math.ceil(total / limit);
  const navigate = useNavigate();

  const debouncedSetSearchTerm = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setPage(1);
    }, 700), // controls how long it takes to when a user types a letter to search (avoids flickering letters)
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setInputTerm(value);
    debouncedSetSearchTerm(value);
  };

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  useEffect(() => {
    const controller = new AbortController();
    const delay = setTimeout(() => setLoading(true), 300);

    fetch(`/api/items?q=${searchTerm}&page=${page}&limit=${limit}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        clearTimeout(delay);
        setItems(data.items);
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
          clearTimeout(delay);
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
      clearTimeout(delay);
    };
  }, [searchTerm, page]);

  const Row = ({ index, style }) => {
    const item = items[index];
    return (
      <div style={style} key={item.id}>
        <button
          className={styles.itemButton}
          onClick={() => navigate(`/item/${item.id}`)}
        >
          {item.name}
          <span style={{ fontSize: '1.2rem', opacity: 0.4 }}>→</span>
        </button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Items</h1>

      <form onSubmit={(e) => e.preventDefault()} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search..."
          value={inputTerm}
          onChange={handleChange}
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>

      {loading ? (
        <ul className={styles.list}>
          {Array.from({ length: limit }).map((_, i) => (
            <li key={i}>
              <div className={styles.skeletonItem}></div>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div className={styles.list}>
            <List
              height={400}
              itemCount={items.length}
              itemSize={65}
              width="100%"
            >
              {Row}
            </List>
          </div>

          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <FaChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`${styles.pageButton} ${page === i + 1 ? styles.active : ''}`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className={styles.pageButton}
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>

          <p style={{ fontSize: '0.9rem' }}>
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} items
          </p>
        </>
      )}
    </div>
  );
}
