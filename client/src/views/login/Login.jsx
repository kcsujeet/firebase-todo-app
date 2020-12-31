import React, {useState, useEffect} from "react";
import {
  Grid,
  GridItem,
  Input,
  Button,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  useToast,
  Box
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import {FaEnvelope, FaLock} from 'react-icons/fa'

import axios from "../../utils/axios";

import "./Login.scss";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async (values) => {
    setLoading(true)
    try {
      let response = await axios.post("/user/login", values);
      await localStorage.setItem("todo_app_auth_token", `Bearer ${response.data.token}`);
      navigate("/");
    } catch (error) {
      let toastOptions = {
                description: error.response ? error.response.data.message :  "Some error occurred",
        position: "top-right",
        status: "error",
        duration: 5000,
        isClosable: true,
      };
      toast(toastOptions);
    }
    setLoading(false)
  };

  const validateFormData = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Required";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate: validateFormData,
    onSubmit: handleFormSubmit,
  });

  useEffect(() => {
    if(localStorage.getItem('todo_app_auth_token')){
      let toastOptions = {
        description: "You are already logged in",
        position: "top-right",
        status: "info",
        duration: 5000,
        isClosable: true,
      };
      toast(toastOptions);
      navigate('/')
    }
  }, [])

  return (
    <Grid templateRows="repeat(4, 1fr)" height="100%" gap={4} justifyContent="center" templateColumns={{ base: ".8fr", md: ".5fr", lg: ".35fr"}}>
      <GridItem px={5} rowStart={2}>
        <Heading>Login</Heading>
        <form onSubmit={formik.handleSubmit} style={{ marginTop: "2rem" }} autoComplete="false">
          <FormControl isInvalid={formik.touched.email && formik.errors.email}>
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaEnvelope color="gray.300" />} />
              <Input name="email" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} placeholder="Email" />
            </InputGroup>
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formik.touched.password && formik.errors.password} style={{ marginTop: ".5rem" }}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaLock color="gray.300" />} />
              <Input
                name="password"
                type="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Password"
              />
            </InputGroup>
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>

          <Button mt={4} width="100%" type="submit" className="bg-purple" 
            isDisabled={formik.errors.email || formik.errors.password}
            isLoading={loading}>
            Sign In
          </Button>
        </form>
        <Box mt={4} fontSize="base">
          Not Registered?  <Box as={Link} to="/signup" color="var(--purple)" _hover={{color: 'teal.500'}}>Sign Up</Box>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default Login;
