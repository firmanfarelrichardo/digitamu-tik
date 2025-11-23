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
                'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ' +
                className
            }
            ref={ref}
        />
    );
});
