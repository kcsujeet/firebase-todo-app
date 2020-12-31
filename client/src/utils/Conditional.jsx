import React from 'react'

const Conditional = props => (
    !!props.if && props.children
);

export default Conditional