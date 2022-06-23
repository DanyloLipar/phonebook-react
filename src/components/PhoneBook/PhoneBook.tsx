import React, { useState, useEffect } from "react";
import classnames from "classnames";
import './PhoneBook.scss';
import { Contact } from "../../types/Contact";
import { PhoneBookContact } from "../PhoneBookContact";
import { addContact, getPeople } from '../../api/api';

export const PhoneBook = () => {
    const [allContacts, setAllContacts] = useState<Contact[]>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');
    const [query, setQuery] = useState('');
    const [contactsLength, setContactsLength] = useState(0);
    const [remove, setRemove] = useState(false);
    const [buttonName, setButtonName] = useState('Edit');
    const [modal, setModal] = useState(false);
    const [phone, setPhone] = useState('+380');
    const [name, setName] = useState('');
    const [inputError, setInputerror] = useState(false);
    const [numbInpError, setNumbInpError] = useState(false);
    const id = new Date().getTime().toString();

    useEffect(() => {
        loadPeople();
    }, [page, search, sort])

    const clear = () => {
        setName('');
        setPhone('+380');
    }

    const loadPeople = () => {
        getPeople(search, sort, page)
            .then(contacts => {
                setAllContacts(contacts.users)
                setContactsLength(contacts.length)
            })
    }

    const addContactToServe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newContact: Contact = {
            id,
            name,
            phoneNumbers: [phone],
        }
        const newName = name;
        console.log(newName)
        if (name && phone.length === 13) {
            await addContact(newContact);
            await loadPeople();
            setModal(false);
            setInputerror(false);
            setNumbInpError(false);
            clear();
        }

        !name ? setInputerror(true) : setInputerror(false);

        phone.length !== 13 ? setNumbInpError(true) : setNumbInpError(false);
    }

    const searchContact = (event: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        const newQuery = query.charAt(0).toUpperCase() + query.slice(1);
        setSearch(newQuery.trim())
        setPage(1);
    }

    return (
        <div className="app__content content">
            {modal && (
                <div className='content__details details'>
                    <form
                        className='details__window window'
                        onSubmit={(event) => {
                            addContactToServe(event);
                        }}
                    >
                        <div className='window__text'>
                            <div className='window__text-inpt'>
                                <label>
                                    Name:
                                    <input
                                        className={classnames({
                                            'red': inputError,
                                        })}
                                        type="text"
                                        value={name}
                                        onChange={(event) => setName(event.target.value.trim())}
                                    />
                                </label>
                                <label>
                                    <p>Phone:<span>13 characters</span></p>
                                    <input
                                        className={classnames({
                                            'red': numbInpError,
                                        })}
                                        type="tel"
                                        value={phone}
                                        onChange={(event) => setPhone(event.target.value.trim())}
                                    />
                                </label>
                            </div>
                            <button
                                onClick={() => {
                                    setModal(false)
                                    setInputerror(false);
                                    setNumbInpError(false);
                                }}
                                className='window__text-close'
                            >
                                Close
                            </button>
                        </div>
                        <button
                            className='window__submition'
                            type='submit'
                        >
                            Add
                        </button>
                    </form>
                </div>
            )}
            <h1
                className="content__title"
            >My Contacts</h1>
            <div className='content__actions actions'>
                <div className='actions__edit'>
                    <img
                        className='actions__edit-sort'
                        src={require('../../photos/sort.png')}
                        alt='sort icon'
                        onClick={() => setSort('desc')}
                    />
                    <button
                        type='submit'
                        className='actions__edit-btn'
                        onClick={() => {
                            setRemove(!remove);
                            remove ? setButtonName('Edit') : setButtonName('Cancel');
                        }}
                    >
                        {buttonName}
                    </button>
                </div>
                <button
                    className='actions__add'
                    onClick={() => setModal(true)}
                >
                    +
                </button>
            </div>
            <div className='content__search search'>
                <form
                    className='search__form'
                    onSubmit={searchContact}
                >
                    <input
                        className='search__form-item'
                        placeholder='Search...'
                        value={query}
                        onChange={event => setQuery(event.currentTarget.value)}
                    />
                    <button className='search__form-submit'>
                        <img
                            src={require('../../photos/search.png')}
                            alt='sort icon'
                        />
                    </button>
                </form>
            </div>
            <ul className="phonebook">
                {allContacts.map(contact => (
                    <li
                        className="phonebook__person"
                        key={contact.id}
                    >
                        <PhoneBookContact
                            contact={contact}
                            remove={remove}
                            loadPeople={loadPeople}
                        />
                    </li>
                ))}
            </ul>
            <div className='switcher'>
                <button className='switcher__btn'
                    onClick={() => {
                        if (page === 1) {
                            return;
                        }
                        setPage(page - 1)
                    }}
                >{'<'}</button>
                <p className='switcher__number'>{page}</p>
                <button
                    className='switcher__btn'
                    onClick={() => {
                        if (page < contactsLength / 8 && allContacts.length === 8) {
                            setPage(page + 1)
                        }
                    }}
                >
                    {'>'}
                </button>
            </div>
        </div>
    )
}