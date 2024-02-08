import express from 'express';
const app = express();
const port = 3000;

export type World = "world";
export type Greeting = `hello ${World}`;

export type EmailLocaleIDs = "welcome_email" | "email_heading";
export type FooterLocaleIDs = "footer_title" | "footer_sendoff";
export type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
export type Lang = "en" | "ja" | "pt";
export type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;

export const user = {
    name: "Daniel",
    age: 26,
};

export interface Animal {
    legs: number;
}
export const cat: Animal = { legs: 4 };

/**
 * This is nice animal and this is a doc.
 */
export type feline = typeof cat;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});