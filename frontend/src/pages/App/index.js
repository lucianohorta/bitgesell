import { Routes, Route } from 'react-router-dom';
import { DataProvider } from '../../state/DataContext';
import Items from '../Items';
import ItemDetail from '../ItemDetail';

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/item/:id" element={<ItemDetail />} />
      </Routes>
    </DataProvider>
  );
}
