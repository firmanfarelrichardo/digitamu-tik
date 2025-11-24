import { forwardRef } from 'react';

export default forwardRef(function SelectInput(
    { className = '', children, ...props },
    ref
) {
    return (
        <select
            {...props}
            className={
                'border-gray-300 focus:border-sky-500 focus:ring-sky-500 rounded-md shadow-sm ' +
                className
            }
            ref={ref}
        >
            {children}
        </select>
    );
});
