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
                'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none ' +
                className
            }
            ref={ref}
        />
    );
});
