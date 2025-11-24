import { forwardRef } from 'react';

export default forwardRef(function TextArea(
    { className = '', rows = 4, ...props },
    ref
) {
    return (
        <textarea
            {...props}
            rows={rows}
            className={
                'border-gray-300 focus:border-sky-500 focus:ring-sky-500 rounded-md shadow-sm ' +
                className
            }
            ref={ref}
        />
    );
});
