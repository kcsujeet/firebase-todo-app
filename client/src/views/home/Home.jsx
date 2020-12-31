import React, { useEffect} from 'react'
import { Grid, GridItem, Box, Avatar, List, ListItem, ListIcon, useToast, Skeleton, SkeletonCircle, Text, Stack, Spinner} from "@chakra-ui/react"
import {Outlet, NavLink, useNavigate} from 'react-router-dom'
import {FaHome, FaUserAlt, FaSignOutAlt} from 'react-icons/fa'
import axios from '../../utils/axios'

import './Home.scss'
import Conditional from '../../utils/Conditional'
import useGlobalState from '../../store/store'
import skeletons from '../../utils/Skeletons'

const Home = ()=>{
    const navigate = useNavigate()
    const toast = useToast()
    const [user, setUser] = useGlobalState('user')
    const [userLoading, setUserLoading] = useGlobalState('userLoading')

    const getUser = async()=>{
        try {
            let response = await axios.get('/user')
            setUser(response.data)
            setUserLoading(false)
        } catch (error) {
            let description = error.response ? error.response.data.message :  "Some error occurred"
            if(error.response && error.response.status === 403){
                localStorage.removeItem('todo_app_auth_token')
                navigate('/login')
                description = 'Login to continue'
            }
            let toastOptions = {
                description: description,
                position: "top-right",
                status: "error",
                duration: 5000,
                isClosable: true,
            }
            toast(toastOptions)
        }
    }

    useEffect(() => {
        getUser()
    }, [])


    const handleLogout = ()=>{
        localStorage.removeItem('todo_app_auth_token')
        navigate('/login')
    }

    return (
        <Grid templateColumns={userLoading ?  '1fr' : {base: "1fr", md: "repeat(4, 1fr)", lg: "repeat(4, 1fr)"}} display={{base: 'block', md: 'grid'}} height="100%" gap={{ base: 0, md: 4, lg: 4}}>
            <Conditional if={userLoading}>
                <GridItem display="flex" alignItems="center" justifyContent="center" height='100vh'>
                    <Spinner color="var(--purple)"
                            size="xl" 
                            thickness="4px"
                            label="Loading ..."
                            speed="0.65s"
                            emptyColor="gray.200"/>
                </GridItem>
            </Conditional>
            <Conditional if={!userLoading}>
                <GridItem colSpan={{md: 1, lg: 1}} className="right-shadow">
                    <Grid templateRows={{md: "repeat(12, 1fr)"}} height={{base: '15%', md: "100%"}}>
                        <GridItem rowStart={{base: 0, md: 2, lg: 2}} rowSpan={{base: 0, md: 3, lg: 3}} >
                            <Conditional if={userLoading}>
                                <Box display="flex" justifyContent="center">
                                    <SkeletonCircle size="20" />
                                    <Skeleton height="8px" mt="1rem"/>
                                </Box>
                            </Conditional>
                            <Conditional if={!userLoading}>
                                <Box>
                                    <Box display="flex" justifyContent="center" mt={{base:4, md: 0}}>
                                        <Avatar size="2xl" name={`${user.firstName}${user.lastName}`} src={user.imageUrl} boxShadow="md"/>
                                    </Box>
                                    <Box display="flex" justifyContent="center" mt="1rem" fontWeight="semibold">
                                        <Text>{user.firstName} {user.lastName}</Text>
                                    </Box>
                                </Box>
                            </Conditional>
                        </GridItem>
                        <GridItem rowStart={{md: 5}} rowSpan={{md: 6}} mt={{md: "2rem"}} display="flex" justifyContent={{base: 'center', md: 'start'}}>
                            <List spacing={{md: 3}} className="menu-list" display={{base: 'inline-flex', md: 'block'}} width={{md: '100%'}}>
                                <ListItem as={NavLink} to="/" activeClassName="active" end>
                                    <ListIcon as={FaHome}/>Home
                                </ListItem>
                                <ListItem as={NavLink} to="/profile" activeClassName="active">
                                    <ListIcon as={FaUserAlt}/>Profile
                                </ListItem>
                                <ListItem onClick={handleLogout} cursor="pointer">
                                    <ListIcon as={FaSignOutAlt}/>Logout
                                </ListItem>
                            </List>
                        </GridItem>
                    </Grid>
                </GridItem>
                <GridItem colSpan={{md: 3, lg: 3}}>
                    <Outlet/>
                </GridItem>
            </Conditional>
        </Grid>
    )
}

export default Home