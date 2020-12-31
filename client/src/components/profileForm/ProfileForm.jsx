import React, {useState} from "react";
import {
  FormControl,
  Heading,
  useToast,
  FormLabel,
  InputGroup,
  Input,
  FormErrorMessage,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate, Link, useLocation } from "react-router-dom";

import axios from "../../utils/axios";
import useGlobalState from "../../store/store";

const TodoForm = (props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useGlobalState('user')

  const handleFormSubmit = async (values) => {
    setIsLoading(true)
    try {
      await axios.put(`/user/update/${user.email}`, values)
      setUser({...user, ...values})
      navigate("/profile");
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
    setIsLoading(false)
  };

  const validateFormData = (values) => {
    const errors = {};
    if (!values.firstName) {
      errors.firstName = "Required";
    }else if(values.firstName.length > 20){
      errors.firstName = "Max length is 20"
    }
    
    if(!values.lastName) {
      errors.lastName = "Required";
    }else if(values.lastName.length > 20){
      errors.lastName = "Max length is 20"
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: location.state ? {firstName: location.state.firstName, lastName: location.state.lastName } : { firstName: "", lastName: "" },
    validate: validateFormData,
    onSubmit: handleFormSubmit,
  });

  return (
    <Grid templateColumns="repeat(8, 1fr)" >
      <GridItem colStart={2} colSpan={6} my="2rem">
        <Heading>Edit Profile</Heading>
        <form onSubmit={formik.handleSubmit} style={{ marginTop: "2rem" }} autoComplete="false">
          <FormControl isInvalid={formik.dirty && formik.errors.firstName}>
            <FormLabel>First Name</FormLabel>
            <InputGroup>
              <Input name="firstName" onChange={formik.handleChange} value={formik.values.firstName} placeholder="First Name" />
            </InputGroup>
            <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formik.dirty && formik.errors.lastName} style={{ marginTop: ".5rem" }}>
            <FormLabel>Last Name</FormLabel>
            <InputGroup>
              <Input name="lastName" onChange={formik.handleChange} value={formik.values.lastName} placeholder="Last Name" />
            </InputGroup>
            <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
          </FormControl>

          <Button isLoading={isLoading} isDisabled={!formik.values.lastName || !formik.values.firstName || formik.errors.lastName || formik.errors.firstName} loadingText="Submitting" mt={4} width="100%" type="submit" className="bg-purple">
            Submit 
          </Button>
          <Button as={Link} to="/profile"  width="100%" mt={4}>Cancel</Button>
        </form>
      </GridItem>
    </Grid>
  );
};

export default TodoForm;
