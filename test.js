const newConnections = [];

for (let i = 1; i < 20; i++) {
    newConnections.push(`Contact_${i}`);
}

newConnections.reverse();

const test = newConnections.slice(-10);

console.log(newConnections);
console.log(test);
