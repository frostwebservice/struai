function getFormattedDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    const timezoneOffset = now.getTimezoneOffset();
    const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffset / 60))
        .toString()
        .padStart(2, "0");
    const timezoneOffsetMinutes = (Math.abs(timezoneOffset) % 60)
        .toString()
        .padStart(2, "0");
    const timezoneSign = timezoneOffset >= 0 ? "-" : "+";

    const res = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`;

    console.log("time of new chat");
    console.log(res);
    return res;
}

export default getFormattedDateTime;
