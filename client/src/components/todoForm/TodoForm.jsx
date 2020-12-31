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
  Textarea,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate, useLocation, Link } from "react-router-dom";

import axios from "../../utils/axios";

const TodoForm = (props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (values) => {
    setIsLoading(true)
    try {
      if(location.state){
        await axios.put(`/todo/update/${location.state.id}`, values)
      }else{
        await axios.post("/todo/new", values)
      }
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
    setIsLoading(false)
  };

  const validateFormData = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = "Required";
    }else if(values.title.length > 50){
      errors.title = "Max length is 50"
    }
    
    if(!values.description) {
      errors.description = "Required";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: location.state ? location.state : { title: "", description: "" },
    validate: validateFormData,
    onSubmit: handleFormSubmit,
  });

  return (
    <Grid templateColumns="repeat(8, 1fr)">
      <GridItem colStart={2} colSpan={6} my="2rem">
        <Heading>{location.state ? "Edit Todo" : "New Todo"}</Heading>
        <form onSubmit={formik.handleSubmit} style={{ marginTop: "2rem" }} autoComplete="false">
          <FormControl isInvalid={formik.touched.title && formik.errors.title}>
            <FormLabel>Title</FormLabel>
            <InputGroup>
              <Input name="title" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.title} placeholder="Title" />
            </InputGroup>
            <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formik.touched.description && formik.errors.description} style={{ marginTop: ".5rem" }}>
            <FormLabel>Description</FormLabel>
            <InputGroup>
              <Textarea name="description" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.description} placeholder="Description" />
            </InputGroup>
            <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
          </FormControl>

          <Button isLoading={isLoading} isDisabled={!formik.values.title || !formik.values.description || formik.errors.title || formik.errors.description} loadingText="Submitting" mt={4} width="100%" type="submit" className="bg-purple">
            Submit 
          </Button>
          <Button as={Link} to="/"  width="100%" mt={4}>Cancel</Button>
        </form>
      </GridItem>
    </Grid>
  );
};

export default TodoForm;
