import { Contact } from "../types/Contact";
const BASE_URL = 'http://localhost:8000';

export const getPeople = async (search: string, sort: string, page: number) => {
    let responce;
    if (search || sort) {
        responce = await fetch(`${BASE_URL}/users?search=${search}&sort=${sort || ''}&page=${page}&quantity=8`);
    } else {
        responce = await fetch(`${BASE_URL}/users?&page=${page}&quantity=8`);
    }
    const data = await responce.json();

    return data;
};

export const getContact = async (userId: string) => {
    const responce = await fetch(`${BASE_URL}/getuserbyid/${userId}`)
    const data = await responce.json();

    return data;
}

export const updateContact = async (updatedContact: Contact, id: string) => {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(updatedContact),
    };

    const responce = await fetch(`${BASE_URL}/updateuser/${id}`, options)
    return responce;
};

export const addContact = async (newContact: Contact) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(newContact),
    };

    const responce = await fetch(`${BASE_URL}/adduser`, options)
    return responce;
};

export const deleteContact = async (contactId: string) => {
    const response = await fetch(`${BASE_URL}/deleteuser/${contactId}`, { method: 'DELETE' })
    return response;
};