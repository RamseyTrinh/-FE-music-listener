import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import axios from "axios";
import {
  Button, TextField, Typography, Grid, Card, Box, CircularProgress, FormControl,
} from '@mui/material';


export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [introduction, setIntro] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    axios
      .post("http://localhost:3000/api/v1/users/signup", {
        name,
        email,
        phone,
        address,
        introduction,
        password,
      })
      .then((result) => {
        if (result.status === 201) {
          window.alert("Sign up successfully!")
          navigate("/login");
        }
        setError("");
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };



  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100%', marginTop: '5rem' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Card sx={{ padding: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: '500' }}>
            Register
          </Typography>
          <Box sx={{ mt: 3 }}>
            <form onSubmit={handleSubmit}>
              <FormControl>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Full Name"
                      type="text"
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      type="Email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Phone Number"
                      type="text"
                      fullWidth
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Adress"
                      type="text"
                      fullWidth
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Retype password"
                      type="password"
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="intro"
                      type="text"
                      fullWidth
                      value={introduction}
                      onChange={(e) => setIntro(e.target.value)}
                      variant="outlined"
                      required
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3 }}>
                  {error && <Alert severity="error">{error}</Alert>}
                  <Button type="submit" variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                    Register now
                  </Button>
                </Box>
              </FormControl>
            </form>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Already have account?
                {' '}
                <Link to="/login">Sign in</Link>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
