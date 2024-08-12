import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/mainpage');
  };

  return (
    <Container maxWidth="200px" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to FPT Radio
      </Typography>
      <Typography variant="h6" component="p" paragraph>
        Hàiii
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleNavigate}
      >
        Go to Main Page
      </Button>
    </Container>
  );
};

export default HomePage;
