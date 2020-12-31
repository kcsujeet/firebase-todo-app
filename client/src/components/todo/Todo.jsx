import React, {useState} from "react";
import { Box, Heading, Text, Grid, GridItem, Menu, MenuButton, 
      MenuList, MenuItem, useToast, Button,
      Modal,
      ModalOverlay,
      ModalContent,
      ModalHeader,
      ModalBody,
      ModalCloseButton, 
      ModalFooter,
    useDisclosure} from "@chakra-ui/react";
import { FaEllipsisH, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {Link, useNavigate} from 'react-router-dom'

import axios from '../../utils/axios'

//import styles
import "./Todo.scss";

const Todo = (props) => {
  const toast = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()


  const handleDelete = async()=>{
    setIsLoading(true)
    try{
      let response = await axios.delete(`/todo/delete/${props.todo.id}`)
      navigate('/todo/new')
      navigate('/')
    }catch(error){
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
  }
  return (
    <Box className="todo-body" mb="1rem">
      <Grid templateColumns="minmax(100%, 1fr)" templateRows="repeat(2, 1fr)" width="100%" height="100%" className="align-items-center">
        <GridItem rowSpan={1}>
          <Grid templateColumns="repeat(2, minmax(50%,1fr))">
            <GridItem colSpan={1}>
              <Heading as="h2" isTruncated>{props.todo.title}</Heading>
            </GridItem>
            <GridItem colSpan={1} style={{ display: 'flex', justifyContent: "flex-end" }}>
              <Menu placement="bottom-end" size="xs">
                <MenuButton as={Button} size="xs" isLoading={isLoading} style={{position: "absolute"}}><FaEllipsisH/></MenuButton>
                <MenuList>
                  <MenuItem size="xs" onClick={onOpen}><FaEye style={{marginRight: ".5rem"}}/> View</MenuItem>
                  <MenuItem as={Link} to='/todo/update' state={props.todo} size="xs"><FaEdit style={{marginRight: ".5rem"}}/> Edit</MenuItem>
                  <MenuItem onClick={handleDelete} size="xs"><FaTrash style={{marginRight: ".5rem"}}/> Delete</MenuItem>
                </MenuList>
              </Menu>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem rowSpan={1}>
          <Text fontSize="lg" isTruncated>{props.todo.description}</Text>
        </GridItem>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
                {props.todo.title}
            </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading size="sm">
              Description
            </Heading>
            {props.todo.description}
          </ModalBody>
          <ModalFooter>
            <Button size="sm" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default Todo;
