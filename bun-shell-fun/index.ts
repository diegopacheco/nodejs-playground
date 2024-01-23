import { $ } from "bun";

const buffer = Buffer.alloc(1024);
await $`ls *.ts > ${buffer}`;
console.log(`result is: \n[${buffer}] END.`);