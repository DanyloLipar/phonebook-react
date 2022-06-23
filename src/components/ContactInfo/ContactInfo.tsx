import React, { useEffect, useState } from "react";
import classnames from 'classnames';
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getContact, updateContact } from "../../api/api";
import { Contact } from "../../types/Contact";
import './ContactInfo.scss';

export const ContactInfo = () => {
    const [contact, setContact] = useState<Contact | null>(null);
    const [newNumber, setNewNumber] = useState('+380');
    const [newNumberSwitcher, setNewNumberSwitcher] = useState(false);
    const [newName, setNewName] = useState('');
    const [newNameSwitcher, setNewNameSwitcher] = useState(false);
    const [inputError, setInputerror] = useState(false);
    const [numbInpError, setNumbInpError] = useState(false);
    const { userId } = useParams();

    useEffect(() => {
        if (userId) {
            getContact(userId)
                .then(user => setContact(user))
        }
    }, [userId])

    const clearNum = () => {
        setNewNumber('+380');
    }

    const clearName = () => {
        setNewName('');
    }

    const loadUser = () => {
        if (userId) {
            getContact(userId)
                .then(user => setContact(user));
        }
    }

    const updateServePhone = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!contact) {
            throw new Error('Your contact is not found!')
        }
        const newUser: Contact = {
            ...contact,
            phoneNumbers: [newNumber, ...contact.phoneNumbers]
        }

        if (contact && userId && newNumber && newNumber.length === 13) {
            await updateContact(newUser, userId);
            loadUser();
            clearNum();
            setNumbInpError(false)
        } else {
            setNumbInpError(true)
        }
    }

    const updateUserName = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!contact) {
            throw new Error('Your contact is not found!')
        }
        const newUser: Contact = {
            ...contact,
            name: newName,
        }

        if (contact && userId && newName) {
            await updateContact(newUser, userId);
            loadUser();
            clearName();
            setNewNameSwitcher(false);
            setInputerror(false);
        } else {
            setInputerror(true)
        }
    }



    const deleteNumber = async (num: string, userId: string) => {
        if (!contact) {
            throw new Error('Your contact is not found!')
        }
        const newUser: Contact = {
            name: contact.name,
            phoneNumbers: contact.phoneNumbers.filter(el => el !== num),
        }
        await updateContact(newUser, userId);
        loadUser();
    }

    return (
        <>
            {contact && (
                <section className="person">
                    <Link to='/' className="person__link">⇦</Link>
                    <div className="person__user user">
                        {newNameSwitcher ? (
                            <form
                                className="user__forms"
                                onSubmit={updateUserName}
                            >
                                <input
                                    className={classnames({
                                        'red': inputError,
                                    })}
                                    value={newName}
                                    onChange={(event) => setNewName(event.target.value.trim())}
                                />
                                <button type="submit">✔️</button>
                                <button onClick={() => {
                                    clearName();
                                    setNewNameSwitcher(false);
                                    setInputerror(false);
                                }}
                                >
                                    🚫
                                </button>
                            </form>
                        ) : (
                            <p className="user__name">{contact.name}
                                <span
                                    onClick={() => setNewNameSwitcher(true)}
                                    className="user__name-edit">✏️
                                </span>
                            </p>
                        )}
                        <div className="user__title">
                            <p>Avilable numbers</p>
                            <p
                                onClick={() => setNewNumberSwitcher(true)}
                                className="user__title-add"
                            >Add</p>
                        </div>
                        {newNumberSwitcher && (
                            <form
                                className="user__forms"
                                onSubmit={updateServePhone}
                            >   <label>
                                    Enter 13 characters
                                    <input
                                        className={classnames({
                                            'red': numbInpError,
                                        })}
                                        value={newNumber}
                                        onChange={(event) => setNewNumber(event.target.value.trim())}
                                    />
                                </label>
                                <button
                                    className="buttons"
                                    type="submit"
                                >
                                    ✔️
                                </button>
                                <button
                                    className="buttons"
                                    onClick={() => {
                                        clearNum();
                                        setNewNumberSwitcher(false);
                                        setNumbInpError(false);
                                    }}
                                >
                                    🚫
                                </button>
                            </form>
                        )}
                        <ul className="user__numbers">
                            {contact.phoneNumbers.map(number => (
                                <li
                                    className="user__numbers-number number"
                                    key={number}
                                >
                                    <h4>{number}</h4>
                                    <p
                                        onClick={() => {
                                            if (userId) {
                                                deleteNumber(number, userId);
                                            }
                                        }}
                                        className="number__delete"
                                    >
                                        ✖️
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </>
    )
}