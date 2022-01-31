import { useState } from 'react';

const showInCartEffect = () => {
    const [showInCart, setShowInCart] = useState( false );
    return [
        showInCart,
        setShowInCart
    ]
};

export default showInCartEffect;