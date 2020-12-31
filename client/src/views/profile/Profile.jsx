import React, {useState} from "react";
import { Button, Grid, GridItem, Heading, Box, List, ListItem, ListIcon, Avatar, Image, useToast, Spinner } from "@chakra-ui/react";
import { FaEdit, FaUser, FaEnvelope, FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";
import useGlobalState from "../../store/store";

//import styles
import "./Profile.scss";
import axios from "../../utils/axios";

const Profile = () => {
  const [user, setUser] = useGlobalState("user");
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false)
  const toast = useToast()

  const handleFileChange = async(e)=>{
    setUploadingProfileImage(true)
    let file = e.target.files[0]
    const formData = new FormData()
    formData.append('profileImage', file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    try{
        let response = await axios.post('/user/image/upload', formData, config)
        setUser({...user, imageUrl: response.data.imageUrl})
        let toastOptions = {
            description: response.data.message,
            position: "top-right",
            status: "success",
            duration: 5000,
            isClosable: true,
        };
      toast(toastOptions);
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

    setUploadingProfileImage(false)
  }

  return (
    <Grid templateColumns="repeat(8, 1fr)" marginTop="5rem">
      <GridItem colStart={2} colSpan={3}>
        <Heading width="100%">Profile</Heading>
      </GridItem>
      <GridItem colStart={6} colSpan={2}>
        <Button as={Link} to="/profile/edit" state={user} leftIcon={<FaEdit />} className="bg-purple" width="100%">
          Edit
        </Button>
      </GridItem>
      <GridItem colStart={2} colSpan={6} mt="2rem">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%">
            <Box display="flex" justifyContent="center" p="2rem" className="profile-picture">
                <Box className="outer">
                    <Image as={Avatar} src={user.imageUrl} alt={user.firstName} boxSize="12rem" boxShadow="md" />
                    <Box className="inner">
                        <Box>
                            <input type="file" onChange={handleFileChange}></input>
                            <label>{uploadingProfileImage ? <Spinner /> : <FaCamera/>}</label>
                        </Box>
                    </Box>
                </Box>
            </Box>
          <Box>
            <List spacing={2} className="profile-list" px={{base: "1rem", md:"4rem"}} pb="4rem">
              <ListItem borderWidth="1px">
                <Grid templateColumns={{base: "repeat(auto-fit, minmax(100%, 1fr));", md: "repeat(2, 1fr)"}} width="100%">
                  <GridItem display="flex" justifyContent={{base: 'center', md: 'flex-start'}}>
                    <ListIcon as={FaUser} color="green.500" />
                    Name:
                  </GridItem>
                  <GridItem display="flex" justifyContent={{base: 'center', md: 'flex-end'}}>
                    {user.firstName} {user.lastName}
                  </GridItem>
                </Grid>
              </ListItem>
              <ListItem borderWidth="1px">
                <Grid templateColumns={{base: "repeat(auto-fit, minmax(100%, 1fr));", md: "repeat(2, 1fr)"}} width="100%">
                  <GridItem display="flex" justifyContent={{base: 'center', md: 'flex-start'}}>
                    <ListIcon as={FaEnvelope} color="green.500" />
                    Email:
                  </GridItem>
                  <GridItem display="flex" justifyContent={{base: 'center', md: 'flex-end'}}>{user.email}</GridItem>
                </Grid>
              </ListItem>
            </List>
          </Box>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default Profile;
