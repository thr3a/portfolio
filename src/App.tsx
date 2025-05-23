import '@mantine/core/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';
import Password from './password/Page';
import Portfolio from './portfolio/Page';
import Template from './template/Page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Portfolio />} />
        <Route path='/template' element={<Template />} />
        <Route path='/password' element={<Password />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
