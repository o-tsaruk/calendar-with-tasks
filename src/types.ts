export type Country = {
  countryCode: string;
  name: string;
};

export type PublicHoliday = {
  date: string;
  name: string;
};

export type CountryHolidayMap = {
  [countryCode: string]: {
    [year: number]: PublicHoliday[];
  };
};

export type Task = {
  date: string;
  text: string;
};
