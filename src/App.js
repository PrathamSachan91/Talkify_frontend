import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from "./Component/Login/login"
import Static from "./Component/Static/Static"
import Landing from './Component/Landing/Landing';
import "./Component/theme.css"
import Signin from "./Component/Signin/Signin"
import ChatDashboard from './Component/Chat/ChatDashboard';
import ImageView from './Component/Chat/imageView';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/Signin' element={<Signin />} />
        <Route element= {<Static/>}>
          <Route path="/" element={<Landing />} />
          <Route path="/chat/:conversationId" element={<ChatDashboard />} />
          <Route path="/image-view" element={<ImageView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
