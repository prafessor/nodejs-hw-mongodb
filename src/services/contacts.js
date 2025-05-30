import { Contact } from '../db/models/contact.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find({ userId });

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

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });

  return contact;
};

export const createContact = async (payload) => {
  const result = await Contact.create(payload);

  return result;
};

export const updateContact = async (contactId, payload, userId) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
    },
  );

  return result;
};

export const deleteContact = async (contactId, userId) => {
  const result = await Contact.findOneAndDelete({ _id: contactId, userId });

  return result;
};
