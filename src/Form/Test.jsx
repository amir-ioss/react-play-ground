import React from 'react'
import Joi from 'joi';
import DynamicForm from './index'
import DropDown from '../Form_old/DropDown'


const Cards = ({ register }) => {
    return <>
        <h2>Select a Card</h2>

        <div style={{ display: "flex", gap: "1rem" }}>
            {/* Card 1 */}
            <label
                style={{
                    // border: selectedCard === "card1" ? "2px solid blue" : "2px solid gray",
                    padding: "1rem",
                    cursor: "pointer",
                }}
            >
                <input
                    type="radio"
                    value="card1"
                    {...register("selectedCard", { required: true })}
                    style={{ display: "none" }}
                />
                Card 1
            </label>

            {/* Card 2 */}
            <label
                style={{
                    // border: selectedCard === "card2" ? "2px solid blue" : "2px solid gray",
                    padding: "1rem",
                    cursor: "pointer",
                }}
            >
                <input
                    type="radio"
                    value="card2"
                    {...register("selectedCard", { required: true })}
                    style={{ display: "none" }}
                />
                Card 2
            </label>

            {/* Card 3 */}
            <label
                style={{
                    // border: selectedCard === "card3" ? "2px solid blue" : "2px solid gray",
                    padding: "1rem",
                    cursor: "pointer",
                }}
            >
                <input
                    type="radio"
                    value="card3"
                    {...register("selectedCard", { required: true })}
                    style={{ display: "none" }}
                />
                Card 3
            </label>


        </div>

    </>
}



export default function index() {

    const formData = [
        {
            type: 'cards',
            name: 'country',
            label: 'Country',
            options: [
                { value: 'usa', title: 'United States' },
                { value: 'canada', title: 'Canada' },
            ],
            validation: Joi.string().required().messages({
                'string.empty': 'Country is required',
            }),
            render: (field) => {
                console.log(field);
                return <div>
                    <Cards register={field.register} />
                    <p className='text-red-600 w-full'>{field.error?.message}</p>
                </div>
            }
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
                return <div className='w-full my-6'>
                    <p className='w-full'>{field.name}</p>
                    <input className='w-full' {...field.register(field.name)} placeholder='test' value={field.value} />
                    <p className='text-red-600 w-full'>{field.error?.message}</p>
                </div>
            }
            // showLabel: false

        },
        {
            type: 'select',
            name: 'country',
            label: 'Country',
            options: [
                { value: 'usa', title: 'United States' },
                { value: 'canada', title: 'Canada' },
            ],
            validation: Joi.string().required().messages({
                'string.empty': 'Country is required',
            }),
            render: (field) => {
                return <DropDown data={field.options} onSelect={_ => null} />
            }
        },
        {
            type: 'email',
            name: 'email',
            label: 'Email',
            validation: Joi.string().email({ tlds: { allow: false } }).required().messages({
                'string.empty': 'Email is required',
                'string.email': 'Email must be a valid email address',
            }),
            layout: 'row',
        },
        {
            type: 'password',
            name: 'password',
            label: 'Password',
            validation: Joi.string().min(6).required().messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters long',
            }),
            layout: 'row',
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
            className: "bg-red-400 border-4 border-black rounded-full",
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
            layout: 'row'
        },
        {
            type: 'search',
            name: 'search',
            label: 'Search',
            layout: 'row'
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
        <div className='m-auto w-1/2 py-12 bg-white px-4'>
            <DynamicForm
                data={formData}
                onSubmit={handleFormSubmit}
                itemClassName="border-red-400"
            // label={false}
            // containerClass="w-full"
            // className="space-between"
            />

        </div>
    )
}

