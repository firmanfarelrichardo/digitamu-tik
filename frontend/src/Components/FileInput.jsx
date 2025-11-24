import { forwardRef } from 'react';

export default forwardRef(function FileInput(
    { className = '', ...props },
    ref
) {
    return (
        <input
            {...props}
            type="file"
            className={
                'border-gray-300 focus:border-sky-500 focus:ring-sky-500 rounded-md shadow-sm ' +
                className
            }
            ref={ref}
        />
    );
});
