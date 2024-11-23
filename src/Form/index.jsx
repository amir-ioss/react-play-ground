import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { twMerge } from 'tailwind-merge'
// www.tailwind-kit.com

// DynamicForm Component
const DynamicForm = ({ data, onSubmit, className: globalClassName, containerClass: globalContainerClass, label: showLabel, labelClassName }) => {
    // Dynamically create the Joi validation schema based on formData
    const validationSchema = Joi.object(
        data.reduce((schema, field) => {
            const { name, validation } = field;
            if (name && validation) {
                schema[name] = validation;
            }
            return schema;
        }, {})
    );

    // Initialize the form with react-hook-form and Joi validation
    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm({
        resolver: joiResolver(validationSchema),
        mode: 'onChange', // Enable real-time validation
    });

    const handleFormSubmit = (formData) => {
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={twMerge(`w-full flex-wrap gap-x-4 bg-white dark_:bg-black rounded-md`, globalClassName)}>
            {data.map((field, index) => {
                const { type, name, label, render, options, className, containerClass, showLabel: f_showLabel, layout, ...rest } = field;

                // Ensure field has a name, otherwise skip rendering.
                if (!name) return null;
                if (render) {
                    let _field = { ...field, register: register, error: errors[name] }
                    // return render?.(_field)
                    return <>

                        <Controller
                            name={field.name}
                            control={control}
                            render={({ field: field_control }) => <>
                                <input className='hidden' value={field_control.value} {...field_control} />
                                {render?.({ ..._field, ...field_control })}
                            </>}
                        />
                    </>

                }

                return (
                    <div key={index} className={twMerge(`${layout == 'row' ? ' flex-1 ' : 'w-full'} flex flex-col space-y-1 mb-4`, globalContainerClass, containerClass)}>
                        {(showLabel == false) ? null : <label className={twMerge(`text-gray-700 font-semibold min-h-6 ${labelClassName}`)}>
                            {f_showLabel == false ? '' : (label || name)}
                            <span class="text-red-500 required-dot">*</span> </label>}

                        {/* Render input based on type */}
                        {type === 'select' ? (
                            <select
                                {...register(name)}
                                {...rest}
                                className={twMerge(`border bg-white border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 `, className)}
                            >
                                {options?.map((option, optIndex) => (
                                    <option key={optIndex} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : type === 'textarea' ? (
                            <textarea
                                {...register(name)}
                                {...rest}
                                className={twMerge(`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 `, className)}
                            ></textarea>
                        ) : type === 'radio' ? (
                            options?.map((option, optIndex) => (
                                // <label key={optIndex} className={twMerge(`inline-flex items-center space-x-2 `, className)}>
                                //     <input
                                //         type="radio"
                                //         value={option.value}
                                //         {...register(name)}
                                //         {...rest}
                                //         className={twMerge(`form-radio text-blue-600 `, className)}
                                //     />
                                //     {option.label}
                                // </label>



                                // <div class="flex items-center mb-4">
                                //     <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                //     <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default checkbox</label>
                                // </div>


                                <label class="inline-flex items-center">
                                    <input type="radio"
                                        value={option.value}
                                        {...register(name)}
                                        {...rest}
                                        className={twMerge(`form-radio text-blue-600 w-5 h-5  `, className)}
                                    />
                                    <span class="ml-2 text-gray-700">
                                        Cycle
                                    </span>
                                </label>

                            ))
                        ) : type === 'checkbox' ? (
                            <div class="relative inline-block w-10 mr-2 align-middle select-none">
                                <label for="Blue" class="block h-6 overflow-hidden bg-gray-300 rounded-full cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register(name)}
                                        {...rest}
                                        className={twMerge(` checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer `, className)}
                                        id="Blue"
                                    />
                                </label>
                            </div>
                            // <input
                            //     type="checkbox"
                            //     {...register(name)}
                            //     {...rest}
                            //     className={twMerge(`form-checkbox text-blue-600 `, className)}
                            // />
                        ) : (
                            <input
                                type={type}
                                {...register(name)}
                                {...rest}
                                className={twMerge(`w-full mt-auto border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 `, className)}
                            />
                        )}

                        {/* Show validation errors */}
                        {errors[name] && (
                            <span className={twMerge(`text-red-500 text-sm mt-1 `, className)}>{errors[name].message}</span>
                        )}
                    </div>
                );
            })}
            <div className='w-full'>

                <button
                    type="submit"
                    className={twMerge(`w-full bg-blue-500 text-white rounded px-4 py-2 mt-4 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors`)}
                >
                    Submit
                </button>
            </div>
        </form>
    );
};


export default DynamicForm;
