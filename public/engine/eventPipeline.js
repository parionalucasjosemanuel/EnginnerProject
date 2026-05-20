const { v4: uuidv4 } = require('uuid');

function logEvent(database, userId, type, payload) {

    const event = {
        id: uuidv4(),
        userId,
        type,
        payload,
        timestamp: new Date().toISOString()
    };

    if (!database.events) database.events = [];

    database.events.push(event);

    return event;
}

module.exports = { logEvent };