import React from 'react';
import ItemAttributesForm from './ItemAttributesForm';

const Item = ({formik}) => {
    return (
        <div>
            <h1 className='text-lg lg:text-xl uppercase font-bold'>Item specifics</h1>
            <ItemAttributesForm formik={formik}  />
        </div>
    );
};

export default Item;