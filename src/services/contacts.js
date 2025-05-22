import { Contact } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();

  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);

  return contact;
};

export const createContact = async (payload) => {
  const result = await Contact.create(payload);

  return result;
};

export const updateContact = async (contactId, payload) => {
  const result = await Contact.findOneAndUpdate({ _id: contactId }, payload, {
    new: true,
  });

  return result;
};

export const deleteContact = async (contactId) => {
  const result = await Contact.findOneAndDelete({ _id: contactId });

  return result;
};
