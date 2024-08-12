import React from 'react';
import Container from '@mui/material/Container';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <Outlet />
        <Footer />
      </Container>
    </>
  );
}

export default Layout;
