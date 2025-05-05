document.addEventListener('DOMContentLoaded', function () {
    const output = document.getElementById('outputField');
    let previousState = []; // Стек для збереження попередніх станів

    // Fetch data from sample.json on page load
    fetch('js/image_sources.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Process the data and display brands
            const parsedData = parseData(data);
            showBrands(parsedData);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            output.innerHTML = `<p style="color: red;">Не вдалося завантажити дані. Перевірте файл sample.json.</p>`;
        });

    // Parse the JSON data into a structured format
    function parseData(data) {
        const structuredData = {};

        Object.keys(data).forEach(key => {
            const [brand, model, year, photo] = key.split('/');
            if (!structuredData[brand]) {
                structuredData[brand] = {};
            }
            if (!structuredData[brand][model]) {
                structuredData[brand][model] = {};
            }
            if (!structuredData[brand][model][year]) {
                structuredData[brand][model][year] = [];
            }
            structuredData[brand][model][year].push(data[key]);
        });

        return structuredData;
    }

    function showBrands(data) {
        // Clear the output field
        output.innerHTML = '<h2>Марки авто:</h2>';

        // Save current state
        previousState = [];

        // Create a button for each brand
        Object.keys(data).forEach(brand => {
            const brandButton = document.createElement('button');
            brandButton.textContent = brand;
            brandButton.addEventListener('click', function () {
                previousState.push(() => showBrands(data)); // Save current state
                showModels(data[brand], brand);
            });
            output.appendChild(brandButton);
        });
    }

    function showModels(brandData, brand) {
        // Clear the output field
        output.innerHTML = `<h2>Моделі для марки: ${brand}</h2>`;

        // Add "Назад" button
        addBackButton();

        // Create a button for each model
        Object.keys(brandData).forEach(model => {
            const modelButton = document.createElement('button');
            modelButton.textContent = model;
            modelButton.addEventListener('click', function () {
                previousState.push(() => showModels(brandData, brand)); // Save current state
                showYears(brandData[model], brand, model);
            });
            output.appendChild(modelButton);
        });
    }

    function showYears(modelData, brand, model) {
        // Clear the output field
        output.innerHTML = `<h2>Роки для моделі: ${model} (${brand})</h2>`;

        // Add "Назад" button
        addBackButton();

        // Create a button for each year
        Object.keys(modelData).forEach(year => {
            const yearButton = document.createElement('button');
            yearButton.textContent = year;
            yearButton.addEventListener('click', function () {
                previousState.push(() => showYears(modelData, brand, model)); // Save current state
                showImages(modelData[year], brand, model, year);
            });
            output.appendChild(yearButton);
        });
    }

    function showImages(images, brand, model, year) {
        // Clear the output field
        output.innerHTML = `<h2>Фото для ${brand} ${model} (${year}):</h2>`;

        // Add "Назад" button
        addBackButton();

        // Display all images for the selected year
        const imageContainer = document.createElement('div');
        imageContainer.style.display = 'flex';
        imageContainer.style.flexWrap = 'wrap';
        imageContainer.style.justifyContent = 'center';
        imageContainer.style.gap = '10px';

        images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `${brand} ${model} ${year}`;
            img.style.maxWidth = '300px'; // Limit image size
            img.style.maxHeight = '200px'; // Prevent overflow
            img.style.objectFit = 'cover';
            imageContainer.appendChild(img);
        });

        output.appendChild(imageContainer);
    }

    function addBackButton() {
        const backButton = document.createElement('button');
        backButton.textContent = 'Назад';
        backButton.style.display = 'block';
        backButton.style.marginBottom = '10px';
        backButton.addEventListener('click', function () {
            if (previousState.length > 0) {
                const lastState = previousState.pop(); // Get the last saved state
                lastState(); // Call the saved state function
            }
        });
        output.appendChild(backButton);
    }
});