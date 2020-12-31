import React, { useState, useEffect } from "react";
import { Grid, GridItem, Heading, Button, useToast, Stack } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

import Todo from "../todo/Todo";
import axios from "../../utils/axios";
import skeletons from "../../utils/Skeletons";
import Conditional from "../../utils/Conditional";
import { Link } from "react-router-dom";
import useGlobalState from "../../store/store";

const TodoList = (props) => {
  const toast = useToast();
  const [todos, setTodos] = useState([]);
  const [todosLoading, setTodosLoading] = useState(true);
  const [user, SetUser] = useGlobalState('user')

  const getUserTodos = async (email) => {
    try {
      let response = await axios.get(`/user/${email}/todos`);
      setTodos(response.data);
      setTodosLoading(false);
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
  };

  useEffect(() => {
    getUserTodos(user.email);
  }, []);


  return (
    <Grid templateColumns="repeat(8, 1fr)" marginTop="5rem">
      <GridItem colStart={2} colSpan={3}>
        <Heading width="100%">TODOs</Heading>
      </GridItem>
      <GridItem colStart={5} colSpan={3}>
        <Button as={Link} to="/todo/new" leftIcon={<FaPlus />} className="bg-purple" width="100%">
          New Todo
        </Button>
      </GridItem>
      <GridItem colStart={2} colSpan={6} mt="2rem">
        <Conditional if={todosLoading}>
          <Stack>
              {skeletons(8)}
          </Stack>
        </Conditional>
        <Conditional if={!todosLoading}>
          { 
            todos.map((todo, index) => {
                return <Todo key={index} todo={todo} width="100%"></Todo>
            })
          }
        </Conditional>
      </GridItem>
    </Grid>
  );
};

export default TodoList;
