function readFile(filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Errow(`HTTP Error: ${response.status}`);
            } return response.json();})
            .then(data => console.log(data))
            .catch(error => console.error('Failed to fetch data:', error));
}

readFile('./example.json')