import React, { useState } from 'react'
import Joi from 'joi';
import DynamicForm from './index'
import DropDown from './DropDown'


export default function index() {

    const formData = [
        {
            type: 'cards',
            name: 'cards',
            label: 'cards',
            options: [
                { value: 'usa', title: 'United States' },
                { value: 'canada', title: 'Canada' },
            ],
            validation: Joi.string().required().messages({
                'string.empty': 'cards is required',
            }),
            render: (field) => {
                console.log({ field });

                return <div className='border'>
                    <h2>Select a Card</h2>
                    <div className='flex gap-x-2'>
                        {new Array(4).fill("*").map((_, id) => <label key={id}
                            className={`border-2 p-2 cursor-pointer ${field.value === "Card " + id ? "border-blue-400" : "border-gray-400"}`}
                            onClick={() => field.onChange("Card " + id)}
                        >
                            Card {id + 1}
                        </label>)}
                    </div>
                    <p className='text-red-600 w-full'>{field.error?.message}</p>
                </div>
            },
        },
        {
            type: 'text',
            name: 'username',
            label: 'Username',
            validation: Joi.string().min(3).max(30).required().messages({
                'string.empty': 'Username is required',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username must be at most 30 characters long',
            }),
            // layout: 'row',
            className: "bg-red-400",
            containerClass: "",
            render: (field) => {
                return <div className='my-6'>
                    <p>{field.name}</p>
                    <input className='w-full' {...field.register(field.name)} placeholder='test' value={field.value} />
                    <p className='text-red-600 w-full'>{field.error?.message}</p>
                </div>
            }
        },
        {
            type: 'select',
            name: 'dropdown',
            label: 'Country',
            options: [
                { value: 'usa', title: 'United States' },
                { value: 'canada', title: 'Canada' },
            ],
            validation: Joi.string().required().messages({
                'string.empty': 'DropDown is required',
            }),
            render: (field) => {
                return <div className='w-[40%]'>
                    <DropDown input={field} data={field.options} onSelect={_ => {
                        // console.log({ _ });
                    }}
                        value={field.value}
                        classNameContainer="w-full"
                    />
                    <p>{field.error?.message}</p>
                </div>
            },


        },
        {
            type: 'email',
            name: 'email',
            label: 'Email',
            validation: Joi.string().email({ tlds: { allow: false } }).required().messages({
                'string.empty': 'Email is required',
                'string.email': 'Email must be a valid email address',
            }),

            // layout: 'row',
        },
        {
            type: 'password',
            name: 'password',
            label: 'Password',
            validation: Joi.string().min(6).required().messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters long',
            }),
            // layout: 'row',
        },
        {
            type: 'number',
            name: 'age',
            label: 'Age',
            validation: Joi.number().min(0).max(100).messages({
                'number.base': 'Age must be a number',
                'number.min': 'Age must be at least 0',
                'number.max': 'Age cannot be more than 100',
            }),
            // className: "bg-red-400 border-4 border-black rounded-full",
        },
        {
            type: 'date',
            name: 'birthdate',
            label: 'Birthdate',
            validation: Joi.date().required().messages({
                'date.base': 'Birthdate must be a valid date',
                'any.required': 'Birthdate is required',
            }),
        },
        {
            type: 'time',
            name: 'preferredTime',
            label: 'Preferred Time',
        },
        {
            type: 'datetime-local',
            name: 'appointment',
            label: 'Appointment',
        },
        {
            type: 'month',
            name: 'birthMonth',
            label: 'Birth Month',
        },
        {
            type: 'week',
            name: 'birthWeek',
            label: 'Birth Week',
        },
        {
            type: 'url',
            name: 'website',
            label: 'Website',
            validation: Joi.string().uri().messages({
                'string.uri': 'Must be a valid URL',
            }),
        },
        {
            type: 'tel',
            name: 'phone',
            label: 'Phone Number',
            validation: Joi.string().pattern(/^[0-9]{10}$/).messages({
                'string.pattern.base': 'Phone number must be 10 digits',
            }),
            // layout: 'row'
        },
        {
            type: 'search',
            name: 'search',
            label: 'Search',
            // layout: 'row'
        },
        // {
        //     type: 'color',
        //     name: 'favoriteColor',
        //     label: 'Favorite Color',
        // },
        {
            type: 'range',
            name: 'volume',
            label: 'Volume',
            min: 0,
            max: 100,
            className: "w-[40%]"
        },
        {
            type: 'file',
            name: 'resume',
            label: 'Upload Resume',
        },
        {
            type: 'checkbox',
            name: 'terms',
            label: 'Agree to Terms',
            validation: Joi.boolean().valid(true).required().messages({
                'any.only': 'You must agree to the terms',
            }),
        },
        {
            type: 'radio',
            name: 'gender',
            label: 'Gender',
            options: [
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
            ],
            validation: Joi.string().valid('male', 'female').required().messages({
                'any.only': 'Gender is required',
            }),
        },
        {
            type: 'select',
            name: 'country',
            label: 'Country',
            options: [
                { value: 'usa', label: 'United States' },
                { value: 'canada', label: 'Canada' },
            ],
            validation: Joi.string().required().messages({
                'string.empty': 'Country is required',
            }),
        },
        {
            type: 'textarea',
            name: 'bio',
            label: 'Bio',
            validation: Joi.string().max(500).messages({
                'string.max': 'Bio must be less than 500 characters',
            }),
        },
        {
            type: 'submit',
            value: 'Submit',
        },
    ];

    // Submit Handler
    const handleFormSubmit = (formValues) => {
        console.log('Form Data:', formValues);
    };


    // Render the form

    return (
        <div
            // className='m-auto w-1/2 py-12 bg-white px-4'
            className='px-4  '
        >
            <DynamicForm
                data={formData}
                onSubmit={handleFormSubmit}
                // itemClassName="border-red-400"
                // label={false}
                // containerClass="w-full"
                className="w-[80%] m-auto flex justify-evenly grid grid-cols-3" 
            />

        </div>
    )
}

