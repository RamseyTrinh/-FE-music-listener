import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import Login from './pages/authen/Login';
import Register from './pages/authen/Register';
import Layout from './layouts/Layout';
import MainPage from './pages/mainpage/MainPage';
import Abc from './pages/mainpage/Abc';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login/>} />
          <Route path="register" element={<Register/>}/>
          <Route path="mainpage" element={<MainPage/>}/>
          <Route path="abc" element={<Abc/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
