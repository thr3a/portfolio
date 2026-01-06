import '@mantine/core/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Example from './example/Page';
import InflationLab from './inflation-lab/Page';
import Make12Page from './make12/Page';
import NotFound from './NotFound';
import Password from './password/Page';
import PayPayShinagawa from './paypay-shinagawa/Page';
import Portfolio from './portfolio/Page';
import RoleplayPage from './roleplay/Page';
import Template from './template/Page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Portfolio />} />
        <Route path='/template' element={<Template />} />
        <Route path='/password' element={<Password />} />
        <Route path='/make12' element={<Make12Page />} />
        <Route path='/paypay-shinagawa' element={<PayPayShinagawa />} />
        <Route path='/example' element={<Example />} />
        <Route path='/inflation-lab' element={<InflationLab />} />
        <Route path='/roleplay' element={<RoleplayPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
