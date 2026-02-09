export const dateTimeLocalToUtc = (dateTime) => {
    return dateTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
}