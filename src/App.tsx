import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ClinicalReview from './pages/ClinicalReview';
import UtiTransfer from './pages/UtiTransfer';
import './index.css';

function App() {
    return (
        <BrowserRouter basename="/clinic-app">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/clinical-review" element={<ClinicalReview />} />
                <Route path="/uti-transfer" element={<UtiTransfer />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
