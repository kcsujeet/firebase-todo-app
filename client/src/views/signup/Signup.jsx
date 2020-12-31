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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import {FaEnvelope, FaLock, FaUser} from 'react-icons/fa'

import axios from "../../utils/axios";

const Signup = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [disableSubmitButton, setDisableSubmitButton] = useState(true)

  const handleFormSubmit = async (values) => {
    setLoading(true)
    try {
      let response = await axios.post("/user/signup", values);
      await localStorage.setItem("todo_app_auth_token", `Bearer ${response.data.token}`);
      let toastOptions = {
        description: "Signed up successfully",
        position: "top-right",
        status: "success",
        duration: 5000,
        isClosable: true,
      };
      toast(toastOptions);
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

    if(!values.firstName){
        errors.firstName = 'Required'
    }else if(values.firstName.legth > 20){
        errors.firstName = 'Max length is 20'
    }

    if(!values.lastName){
        errors.lastName = 'Required'
    }else if(values.lastName.legth > 20){
        errors.lastName = 'Max length is 20'
    }

    if (!values.email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Required";
    }

    if(!values.password_confirmation){
        errors.password_confirmation = "Required"
    }else if(values.password !== values.password_confirmation){
        errors.password_confirmation = "Passwords don't match"
    }

    Object.keys(errors).length > 0  && setDisableSubmitButton(true)
    Object.keys(errors).length === 0  && setDisableSubmitButton(false)

    return errors;
  };

  const formik = useFormik({
    initialValues: {firstName: '', lastName: '', email: "", password: "", password_confirmation: '' },
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
    <Grid templateRows="repeat(3, 1fr)" templateColumns={{ base: ".8fr", md: ".5fr", lg: ".4fr"}} height="100%" gap={4} justifyContent="center">
      <GridItem rowStart={2} px={5}>
        <Heading>Sign Up</Heading>
        <form onSubmit={formik.handleSubmit} style={{ marginTop: "2rem" }} autoComplete="false">
            <Grid templateColumns="repeat(2, 45%)" gap="10%">
                <GridItem>
                        <FormControl isInvalid={formik.touched.firstName && formik.errors.firstName}>
                        <FormLabel>First Name</FormLabel>
                        <InputGroup>
                            <InputLeftElement children={<FaUser color="gray.300" />} />
                            <Input name="firstName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.firstName} placeholder="First Name" />
                        </InputGroup>
                        <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                <FormControl isInvalid={formik.touched.lastName && formik.errors.lastName}>
                        <FormLabel>Last Name</FormLabel>
                        <InputGroup>
                            <InputLeftElement children={<FaUser color="gray.300" />} />
                            <Input name="lastName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.lastName} placeholder="Last Name" />
                        </InputGroup>
                        <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
                    </FormControl>
                </GridItem>
            </Grid>
            

          <FormControl isInvalid={formik.touched.email && formik.errors.email} mt=".5rem">
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaEnvelope color="gray.300" />} />
              <Input name="email" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} placeholder="Email" />
            </InputGroup>
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formik.touched.password && formik.errors.password} mt=".5rem">
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

          <FormControl isInvalid={formik.touched.password_confirmation && formik.errors.password_confirmation} mt=".5rem">
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaLock color="gray.300" />} />
              <Input
                name="password_confirmation"
                type="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password_confirmation}
                placeholder="Confirm Password"
              />
            </InputGroup>
            <FormErrorMessage>{formik.errors.password_confirmation}</FormErrorMessage>
          </FormControl>

          <Button mt={4} width="100%" type="submit" className="bg-purple" 
            isDisabled={disableSubmitButton}
            isLoading={loading}>
            Sign Up
          </Button>
        </form>
      </GridItem>
    </Grid>
  );
};

export default Signup;
