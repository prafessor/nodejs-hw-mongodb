import { Contact } from '../db/models/contact.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find();

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    Contact.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    contacts,
    paginationData,
  };
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
