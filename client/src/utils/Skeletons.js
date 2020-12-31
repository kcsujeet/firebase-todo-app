import {React} from 'react'
import {Skeleton} from '@chakra-ui/react'

const Skeletons = (n)=>{
    let list = []
    for(var i=0; i < n ; i++){
      list.push(<Skeleton key={i} height="20px" />)
    }
    return list
}

export default Skeletons