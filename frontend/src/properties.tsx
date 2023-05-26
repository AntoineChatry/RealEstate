import React, { useState, ChangeEvent, FormEvent } from 'react';
// import axios from 'axios';

interface Property {
    title: string;
    description: string;
    price: number;
    location: string;
}

const PropertyForm: React.FC = () => {
    const [property, setProperty] = useState<Property>({
        title: '',
        description: '',
        price: 0,
        location: '',
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // Send a POST request to create a new property
            console.log(property);
            const response = await fetch('http://127.0.0.1:8000/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(property),
            });
            if (response.ok) {
                console.log('Property data submitted successfully');
            } else {
                throw new Error(`HTTP status ${response.status}`);
            }
        } catch (error) {
            console.error('Error submitting property data:', error);
        }
    };




    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProperty((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input
                    type="text"
                    name="title"
                    value={property.title}
                    onChange={handleChange}
                />
            </label>
            <label>
                Description:
                <textarea
                    name="description"
                    value={property.description}
                    onChange={handleChange}
                />
            </label>
            <label>
                Price:
                <input
                    type="number"
                    name="price"
                    value={property.price}
                    onChange={handleChange}
                />
            </label>
            <label>
                Location:
                <input
                    type="text"
                    name="location"
                    value={property.location}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default PropertyForm;
