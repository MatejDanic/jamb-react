const dateFormatShort = new Intl.DateTimeFormat('hr-HR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'});
const dateFormatLong = new Intl.DateTimeFormat('hr-HR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'});

export { dateFormatShort };
export { dateFormatLong };