import React from 'react';
import { Routes, Route } from "react-router-dom";
import { PhoneBook } from './components/PhoneBook';
import './styles/App.scss';
import { ContactInfo } from './components/ContactInfo';

const App = () => {

  return (
    <section className='app'>
      <Routes>
        <Route path="/" element={<PhoneBook />} />
        <Route path={`/users/:userId`} element={<ContactInfo />} />
      </Routes>
    </section>
  );
}

export default App;
