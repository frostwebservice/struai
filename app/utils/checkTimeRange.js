function checkDate(date) {
    // Get today's date.
    const today = new Date();

    // Calculate the difference between the given date and today's date in milliseconds.
    const diff = today - date;

    // Check if the given date is today.
    if (diff === 0) {
        return "Today";
    }

    // Check if the given date is yesterday.
    if (diff === 86400000) {
        return "Yesterday";
    }

    // Check if the given date is last week.
    if (diff > 86400000 && diff <= 604800000) {
        return "Last week";
    }

    // Check if the given date is last month.
    if (diff > 604800000 && diff <= 2592000000) {
        return "Last month";
    }

    // Check if the given date is last year.
    if (diff > 2592000000 && diff <= 31536000000) {
        return "Last year";
    }

    // If the given date is older than last year, return "Older".
    return "Older";
}

function checkTimeRange(dateTimeStr) {
    // return checkDate(new Date(dateTimeStr).getTime());
    const dt = new Date(dateTimeStr);
    const currentDateTime = new Date();

    const today = new Date(currentDateTime);
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastYear = new Date(today);
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    if (dt >= today) {
        return "Today";
    } else if (dt >= yesterday) {
        return "Yesterday";
    } else if (dt >= lastWeek) {
        return "Last Week";
    } else if (dt >= lastMonth) {
        return "Last Month";
    } else if (dt >= lastYear) {
        return "Last Year";
    } else {
        // return "More than a year ago";
        // revisit on how to handle for different timezones - this is a temporary fix
        return "Today";
    }
}

export default checkTimeRange;
