const dateFormatShort = new Intl.DateTimeFormat('hr-HR', { year: 'numeric', month: 'numeric', day: 'numeric' });
const dateFormatMedium = new Intl.DateTimeFormat('hr-HR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'});
const dateFormatLong = new Intl.DateTimeFormat('hr-HR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'});

const hourFormat = new Intl.DateTimeFormat('hr-HR', { hour: 'numeric', minute: 'numeric'});

export { dateFormatShort };
export { dateFormatMedium };
export { dateFormatLong };
export { hourFormat };