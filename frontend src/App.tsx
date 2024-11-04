import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReportConfiguration from './pages/reportConfiguration/ReportConfiguration';
import ChatContainer from './components/reportConfiguration/chatContainer/ChatContainer';
import EconomicDataPage from './pages/economicDataPage/EconomicDataPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<ReportConfiguration />} />
          <Route path="/economicData" element={<EconomicDataPage />} />
        </Routes>
      </BrowserRouter>

      <ChatContainer />
    </div>
  );
}

export default App;
