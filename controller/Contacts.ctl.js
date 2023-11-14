const ContactModel = require('../model/Contact.model');
class ContactController {
    async showAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const totalContact = await ContactModel.countDocuments();
            const totalPages = Math.ceil(totalContact / limit);

            const contacts = await ContactModel.find()
                .skip((page - 1) * limit)
                .limit(limit);
            if (!contacts) {
                return res.status(400).json({ msg: 'contacts not found' });
            }
            res.status(200).json({ contacts, totalPages, page, totalContact });
        } catch (error) {
            return res.status(400).json({ msg: 'Error get all contact', error: error });
        }
    }

    async createContact(req, res) {
        try {
            const { nameContact, emailContact, phoneContact, contentContact } = req.body;

            const contact = new ContactModel({
                nameContact,
                emailContact,
                phoneContact,
                contentContact,
            });
            await contact.save();
            res.status(200).json({ msg: 'Post Contact Success' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error create new a contact', error: error });
        }
    }

    async detail(req, res) {
        try {
            const { _id } = req.params;
            const contact = await ContactModel.findById({ _id });
            if (!contact) return res.status(400).json({ msg: 'contact not found' });
            res.status(200).json(contact);
        } catch (error) {
            return res.status(400).json({ msg: 'Error Get Detail contact', error: error });
        }
    }

    async deleteContact(req, res) {
        try {
            const { _id } = req.params;
            // Check Contact
            const contact = await ContactModel.findById({ _id: _id });

            if (!contact) return res.status(404).json({ msg: 'contact not found' });
            await ContactModel.findOneAndDelete({ _id });
            res.status(200).json({ msg: 'contact removed successfully' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error contact Delete', error: error });
        }
    }
}

module.exports = new ContactController();
