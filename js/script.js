document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('submitButton');
    const input = document.getElementById('textInput');
    const output = document.getElementById('outputField');
    const fetchButton = document.getElementById('fetchButton'); // Button for fetching JSON

    button.addEventListener('click', function() {
        const inputValue = input.value;
        // Порахувати кількість слів та вивести результат
        const wordCount = inputValue.trim().split(/\s+/).length;
        console.log(wordCount);
        output.textContent = `Word count: ${wordCount}`;
    });

    fetchButton.addEventListener('click', function() {
        fetch('js/sample.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Clear the output field
                output.innerHTML = '';

                // Create sections for Марка, Модель, Рік, and Фото
                const brandSection = document.createElement('div');
                brandSection.textContent = `Марка: ${data.brand}`;
                output.appendChild(brandSection);

                const modelSection = document.createElement('div');
                modelSection.textContent = `Модель: ${data.model}`;
                output.appendChild(modelSection);

                const yearSection = document.createElement('div');
                yearSection.textContent = `Рік: ${data.year}`;
                output.appendChild(yearSection);

                const photoSection = document.createElement('div');
                const img = document.createElement('img');
                img.src = data.photo;
                img.alt = `${data.brand} ${data.model}`;
                img.style.maxWidth = '200px'; // Optional: Limit image size
                photoSection.appendChild(img);
                output.appendChild(photoSection);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                output.textContent = 'Error fetching JSON file.';
            });
    });
});