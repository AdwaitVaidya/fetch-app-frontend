import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import { login } from "../services/auth";
import {
  Avatar,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import ReactLoading from "react-loading";

interface LoginScreenProps {
  setAuthenticated: (authenticated: boolean) => void;
}

const Login: React.FC<LoginScreenProps> = ({ setAuthenticated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const defaultTheme = createTheme();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDone(true);
    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();
    const name = data.get("name")?.toString();
    try {
      if (email == null || name == null) {
        return;
      }
      await login(name, email);
      setAuthenticated(true);
      navigate("/search");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="name"
              id="name"
              name="name"
              autoComplete="current-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            {!done ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
            ) : (
              <ReactLoading
                type={"bars"}
                color={"#03fc4e"}
                height={100}
                width={100}
              />
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
