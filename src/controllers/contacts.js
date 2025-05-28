// import { Types } from 'mongoose';
import createHttpError from 'http-errors';

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Succesfully found contacts!',
    data: {
      data: contacts.contacts,
      ...contacts.paginationData
    }
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  // if (!Types.ObjectId.isValid(contactId)) {
  //   next(createHttpError(400, 'Id is invalid'));
  //   return;
  // }

  const contact = await getContactById(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const result = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: result,
  });
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await updateContact(contactId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await deleteContact(contactId);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).end();
};
