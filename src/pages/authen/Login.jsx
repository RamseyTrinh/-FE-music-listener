import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {Button, TextField, Typography, Grid, Card, Box,Alert} from '@mui/material';
import React, { Component } from 'react'
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };
    fetch("http://localhost:3000/api/v1/login", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError("Invalid email or password");
          throw Error("Invalid credentials")
        }
        const token = data.token
        console.log(data)
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("uid", data.uid);
        localStorage.setItem("role", data.userRole);

        navigate('/');
      })
      .catch(error => {
        console.error(error);
      });
  }
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("Logged out & Token removed");
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100%', marginTop: '5rem' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Card sx={{ padding: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: '500' }}>
            Đăng nhập
          </Typography>
          <Box sx={{ mt: 3 }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Mật khẩu"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3 }}>
                {error && <Alert severity="error">{error}</Alert>}
                <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                  Sign in
                </Button>
              </Box>
            </form>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Do not have an account?
                {' '}
                <RouterLink to="/register">Register</RouterLink>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Login;
