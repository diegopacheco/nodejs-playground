import { z } from "zod/v4";

const Player = z.object({ 
    username: z.string(),
    xp: z.number()
});

let res = Player.parse({ username: "billie", xp: 100 }); 
console.log(res); // { username: 'billie', xp: 100 }  

try {
    Player.parse({ username: 42, xp: false });
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
    console.log(err.issues);
  }