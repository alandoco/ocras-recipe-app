exports.checkIfValidUpdate = (updates, allowedUpdates) => {
    return updates.every((update) => allowedUpdates.includes(update))
}