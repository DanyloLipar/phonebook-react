import React from "react";
import './PhoneBookContact.scss';
import { deleteContact } from "../../api/api";
import { Link } from "react-router-dom";
import { Contact } from "../../types/Contact";

type Props = {
    contact: Contact,
    remove: boolean,
    loadPeople: () => void;
}

export const PhoneBookContact: React.FC<Props> = ({
    contact,
    remove,
    loadPeople,
}) => {

    const deleteContactFromServer = async (contactId: string) => {
        await deleteContact(contactId);
        await loadPeople();
    };


    return (
        <div className="contact">
            <Link to={`/users/${contact.id}`} className="contact__name">{contact.name}</Link>
            {remove && (<button
                className="contact__remove"
                onClick={() => {
                    if (contact.id) {
                        deleteContactFromServer(contact.id)
                    } else {
                        throw new Error('Contact ID not found')
                    }
                }}
            >
                ✖️
            </button>)}
        </div>
    )
}
