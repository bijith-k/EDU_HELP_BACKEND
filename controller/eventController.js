const events = require('../models/eventsModel')


module.exports.addEvent = async (req, res, next) => {
  try {


    const user = req.user

    const filePath = req.file.path.replace("public", "");
    let link = req.body.link;

    // Check if the link starts with "http://" or "https://"
    if (!/^https?:\/\//i.test(link)) {
      // If it doesn't, prepend "http://" to the link
      link = "http://" + link;
    }

    const event = new events({
      name: req.body.name,
      organizer: req.body.organizer,
      location: req.body.location,
      description: req.body.description,
      startingDate: req.body.startingDate,
      endingDate: req.body.endingDate,
      link,
      contact: req.body.contact,
      poster: filePath,
      uploadedBy: user,
    });

    await event.save()

    res.json({ message: "Event added successfully", added: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", added: false });

  }
}


module.exports.adminAllEvents = async (req, res, next) => {
  try {
    if (req.query.id) {

      const { id } = req.query

      const event = await events.findOne({ _id: id })

      res.json(event);
    } else {
      const event = await events.find({ rejected: false })

      res.json(event);
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports.adminEventListOrUnList = async (req, res, next) => {
  try {
    const { event } = req.query
    const eventToListOrUnList = await events.findById(event)
    if (eventToListOrUnList.listed) {

      await events.updateOne({ _id: event }, { $set: { listed: false } })
      res.json({ message: 'Event is successfully unlisted', success: true })
    } else {
      await events.updateOne({ _id: event }, { $set: { listed: true } })
      res.json({ message: 'Event is successfully listed', success: true })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", success: false });
  }
}


module.exports.adminApproveEvent = async (req, res, next) => {
  try {

    const { event } = req.query
    await events.updateOne({ _id: event }, { $set: { approved: true, listed: true } })
    res.json({ message: "Event approved successfully", approved: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", approved: false });
  }
}
module.exports.adminRejectEvent = async (req, res, next) => {
  try {

    const { event } = req.query
    await events.updateOne({ _id: event }, { $set: { rejected: true } })
    res.json({ message: "Event rejected successfully", rejected: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", rejected: false });
  }
}

module.exports.updateEvent = async (req, res, next) => {
  try {


    const { event } = req.query


    const formatDate = (date) => {
      const [day, month, year] = date.split('/')
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.00Z`;
      return isoDate
    }

    const startDate = formatDate(req.body.startingDate)
    const endDate = formatDate(req.body.endingDate)

    let updatedData = {
      name: req.body.name,
      organizer: req.body.organizer,
      location: req.body.location,
      description: req.body.description,
      startingDate: startDate,
      endingDate: endDate,
      link: req.body.link,
      contact: req.body.contact
    }

    if (req.file) {
      updatedData.poster = req.file.path.replace("public", "");
    }

    let updatedEvent = await events.findByIdAndUpdate({ _id: event }, updatedData)

    if (updatedEvent) {
      res.json({ message: "Event is updated successfully", updated: true });
    } else {
      res.status(500).json({ message: "Error while updating", updated: false });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", updated: false });
  }
}


module.exports.getEvents = async (req, res, next) => {
  try {
    const { id } = req.query

    if (id) {
      const event = await events.find({ uploadedBy: { $in: [id] } })

      res.json(event);
    }
    else {
      const event = await events.find({ listed: true })

      res.json(event);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
