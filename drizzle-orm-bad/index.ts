import { getAllUsers } from "./src/db/queries";

const { createUser, getUserById } = require('./src/db/queries');

(async () => {
  try {
    await createUser({ name: 'Alice', age: 30, email: 'a@e.com' });
  } catch (error) {
    console.log('Ignoring duplicate user: Alice');
  }
  try {
    await createUser({ name: 'Bob', age: 40, email: 'b@e.com' });
  } catch (error) {
    console.log('Ignoring duplicate user: Bob');
  }
  try {
    await createUser({ name: 'Charlie', age: 50, email: 'c@e.com' });
  } catch (error) {
    console.log('Ignoring duplicate user: Charlie');
  }
  const user = await getUserById(1);
  console.log(user);

  const users = await getAllUsers();
  console.log(users);
})();