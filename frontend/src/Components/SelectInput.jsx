import { forwardRef } from 'react';

export default forwardRef(function SelectInput(
    { className = '', children, ...props },
    ref
) {
    return (
        <select
            {...props}
            className={
                'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-white ' +
                className
            }
            ref={ref}
        >
            {children}
        </select>
    );
});
