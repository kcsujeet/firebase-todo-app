import { GridItem, Grid, Heading } from '@chakra-ui/react'
import React from 'react'

const ErrorPage  = ()=>{
    return (
        <Grid templateRows="repeat(12, 1fr)" templateColumns="repeat(12, 1fr)" height="100%" gap={4}>
            <GridItem colStart={5} colSpan={4} rowStart={4} d="flex" justifyContent="center">
                <Heading as="h1">Error 404: Not found</Heading>
            </GridItem>
        </Grid>
    )
}

export default ErrorPage