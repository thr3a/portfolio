import '@mantine/core/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Example from './example/Page';
import ImageEditorPage from './image-editor/Page';
import InflationLab from './inflation-lab/Page';
import KnightsKnavesPage from './knights-knaves/Page';
import Make12Page from './make12/Page';
import NotFound from './NotFound';
import Password from './password/Page';
import PayPayShinagawa from './paypay-shinagawa/Page';
import Portfolio from './portfolio/Page';
import RoleplayPage from './roleplay/Page';
import TwitterSearchHelper from './twitter/Page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Portfolio />} />
        <Route path='/password' element={<Password />} />
        <Route path='/make12' element={<Make12Page />} />
        <Route path='/paypay-shinagawa' element={<PayPayShinagawa />} />
        <Route path='/example' element={<Example />} />
        <Route path='/inflation-lab' element={<InflationLab />} />
        <Route path='/image-editor' element={<ImageEditorPage />} />
        <Route path='/roleplay' element={<RoleplayPage />} />
        <Route path='/knights-knaves' element={<KnightsKnavesPage />} />
        <Route path='/twitter' element={<TwitterSearchHelper />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
