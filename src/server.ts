import app from "./app.js"

const port = 3002
const url = `http://localhost:${port}`;

app.listen(port, () => {
    console.log('\n==========================================================================================');
    console.log(`🚀 Server running at ${url} 👈 Ctrl+Click the open!!!`);
    console.log('==========================================================================================\n');
})