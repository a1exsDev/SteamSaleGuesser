function readFile(filePath) {
    console.log(`Reading file from: ${filePath}`);
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Errow(`HTTP Error: ${response.status}`);
            } return response.json();})
            .then(data => console.log(data))
            .catch(error => console.error('Failed to fetch data:', error));
}
console.log('blah blah blah');
readFile('./example.json')