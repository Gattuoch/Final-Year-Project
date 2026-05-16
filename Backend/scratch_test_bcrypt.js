const bcrypt = require('bcryptjs');

const hash = "$2b$10$M760mKV8X4Nsc41ATgazfupgdsbthUXoUwm3HQ1YU5SMnLFrqnvRa";
// We don't know the plain password, but we can try common ones if we suspect something.
// But wait, I can just try to hash a known password and see if it looks similar.

async function test() {
    const pass = "password123"; // Just a guess
    const match = await bcrypt.compare(pass, hash);
    console.log('Match:', match);
}

test();
