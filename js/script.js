document.addEventListener('DOMContentLoaded', function () {
    const output = document.getElementById('outputField');
    const topSection = document.createElement('div'); // Верхня секція для вибору марки
    const middleSection = document.createElement('div'); // Середня секція для вибору моделей
    const yearSection = document.createElement('div'); // Секція для вибору років
    const bottomSection = document.createElement('div'); // Нижня секція для відображення фото
    output.appendChild(topSection);
    output.appendChild(middleSection);
    output.appendChild(yearSection);
    output.appendChild(bottomSection);

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
            bottomSection.innerHTML = `<p style="color: red;">Не вдалося завантажити дані. Перевірте файл sample.json.</p>`;
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
        // Clear the top section
        topSection.innerHTML = '<h2>Марки авто:</h2>';

        // Sort brands alphabetically
        const sortedBrands = Object.keys(data).sort();

        // Create a button for each brand
        sortedBrands.forEach(brand => {
            const brandButton = document.createElement('button');
            brandButton.textContent = brand;
            brandButton.addEventListener('click', function () {
                showModels(data[brand], brand);
            });
            topSection.appendChild(brandButton);
        });

        // Clear the middle, year, and bottom sections
        middleSection.innerHTML = '';
        yearSection.innerHTML = '';
        bottomSection.innerHTML = '';
    }

    function showModels(brandData, brand) {
        // Clear the middle section
        middleSection.innerHTML = `<h2>Моделі для марки: ${brand}</h2>`;

        // Sort models alphabetically
        const sortedModels = Object.keys(brandData).sort();

        // Create a button for each model
        sortedModels.forEach(model => {
            const modelButton = document.createElement('button');
            modelButton.textContent = model;
            modelButton.addEventListener('click', function () {
                showYears(brandData[model], brand, model);
            });
            middleSection.appendChild(modelButton);
        });

        // Clear the year and bottom sections
        yearSection.innerHTML = '';
        bottomSection.innerHTML = '';
    }

    function showYears(modelData, brand, model) {
        // Clear the year section
        yearSection.innerHTML = `<h2>Роки для моделі: ${model} (${brand})</h2>`;

        // Create a button for each year
        Object.keys(modelData).forEach(year => {
            const yearButton = document.createElement('button');
            yearButton.textContent = year;
            yearButton.addEventListener('click', function () {
                showImages(modelData[year], brand, model, year);
            });
            yearSection.appendChild(yearButton);
        });

        // Clear the bottom section
        bottomSection.innerHTML = '';
    }

    function showImages(images, brand, model, year) {
        // Clear the bottom section
        bottomSection.innerHTML = `<h2>Фото для ${brand} ${model} (${year}):</h2>`;

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

            // Hide the image if it fails to load
            img.onerror = function () {
                img.style.display = 'none';
                console.warn(`Image not found: ${imageUrl}`);
            };

            imageContainer.appendChild(img);
        });

        bottomSection.appendChild(imageContainer);
    }
});