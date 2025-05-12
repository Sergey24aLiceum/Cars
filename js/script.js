window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500); // Затримка для плавного зникнення
});

document.addEventListener('DOMContentLoaded', function () {
    const output = document.getElementById('outputField');
    const siteFiles = document.getElementById('siteFiles');
    const pcFiles = document.getElementById('pcFiles');
    const uploadFileButton = document.getElementById('uploadFileButton');
    const fileInput = document.getElementById('fileInput');
    const topSection = document.createElement('div'); // Верхня секція для вибору марки
    const middleSection = document.createElement('div'); // Середня секція для вибору моделей
    const yearSection = document.createElement('div'); // Секція для вибору років
    const bottomSection = document.createElement('div'); // Нижня секція для відображення фото

    topSection.classList.add('section');
    middleSection.classList.add('section');
    yearSection.classList.add('section');
    bottomSection.classList.add('section');

    output.appendChild(topSection);
    output.appendChild(middleSection);
    output.appendChild(yearSection);
    output.appendChild(bottomSection);

    let currentImages = [];

    // Завантаження даних із файлів на сайті
    siteFiles.addEventListener('change', () => {
        const selectedFile = siteFiles.value;
        loadData(selectedFile);
    });

    // Завантаження даних із початкового файлу
    loadData(siteFiles.value);

    // Обробка кнопки "Вибрати файл"
    uploadFileButton.addEventListener('click', () => {
        fileInput.click(); // Відкриваємо діалог вибору файлу
    });

    // Обробка вибраного файлу з ПК
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const parsedData = parseData(data);
                    showBrands(parsedData);

                    // Додаємо файл у випадаючий список для файлів з ПК
                    let customOption = document.createElement('option');
                    customOption.value = file.name;
                    customOption.dataset.fileContent = e.target.result; // Зберігаємо вміст файлу
                    customOption.textContent = file.name;
                    pcFiles.appendChild(customOption);
                    pcFiles.value = file.name; // Вибираємо цей файл
                } catch (error) {
                    console.error('Помилка при обробці файлу:', error);
                    output.innerHTML = `<p style="color: red;">Неправильний формат файлу. Завантажте коректний JSON-файл.</p>`;
                }
            };
            reader.readAsText(file);
        }
    });

    // Завантаження даних із файлів з ПК
    pcFiles.addEventListener('change', () => {
        const selectedOption = pcFiles.options[pcFiles.selectedIndex];
        const fileContent = selectedOption.dataset.fileContent;
        if (fileContent) {
            loadCustomFile(fileContent);
        }
    });

    function loadData(file) {
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const parsedData = parseData(data);
                showBrands(parsedData);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                output.innerHTML = `<p style="color: red;">Не вдалося завантажити дані з файлу ${file}. Перевірте файл.</p>`;
            });
    }

    function loadCustomFile(fileContent) {
        try {
            const data = JSON.parse(fileContent);
            const parsedData = parseData(data);
            showBrands(parsedData);
        } catch (error) {
            console.error('Помилка при обробці файлу:', error);
            output.innerHTML = `<p style="color: red;">Неправильний формат файлу. Завантажте коректний JSON-файл.</p>`;
        }
    }

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
        topSection.innerHTML = '<h2>Марки авто:</h2>';
        topSection.classList.add('active'); // Анімація появи

        const sortedBrands = Object.keys(data).sort();

        sortedBrands.forEach(brand => {
            const brandButton = document.createElement('button');
            brandButton.textContent = brand;
            brandButton.addEventListener('click', function () {
                showModels(data[brand], brand);
                middleSection.classList.add('active'); // Анімація появи
            });
            topSection.appendChild(brandButton);
        });

        middleSection.innerHTML = '';
        yearSection.innerHTML = '';
        bottomSection.innerHTML = '';
    }

    function showModels(brandData, brand) {
        middleSection.innerHTML = `<h2>Моделі для марки: ${brand}</h2>`;

        const sortedModels = Object.keys(brandData).sort();

        sortedModels.forEach(model => {
            const modelButton = document.createElement('button');
            modelButton.textContent = model;
            modelButton.addEventListener('click', function () {
                showYears(brandData[model], brand, model);
                yearSection.classList.add('active'); // Анімація появи
            });
            middleSection.appendChild(modelButton);
        });

        yearSection.innerHTML = '';
        bottomSection.innerHTML = '';
    }

    function showYears(modelData, brand, model) {
        yearSection.innerHTML = `<h2>Роки для моделі: ${model} (${brand})</h2>`;

        Object.keys(modelData).forEach(year => {
            const yearButton = document.createElement('button');
            yearButton.textContent = year;
            yearButton.addEventListener('click', function () {
                showImages(modelData[year], brand, model, year);
                bottomSection.classList.add('active'); // Анімація появи
            });
            yearSection.appendChild(yearButton);
        });

        bottomSection.innerHTML = '';
    }

    function showImages(images, brand, model, year) {
        bottomSection.innerHTML = `<h2>Фото для ${brand} ${model} (${year}):</h2>`;
        const imageContainer = document.createElement('div');
        imageContainer.style.display = 'flex';
        imageContainer.style.flexWrap = 'wrap';
        imageContainer.style.justifyContent = 'center';
        imageContainer.style.gap = '10px';

        images.forEach((imageUrl, index) => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `${brand} ${model} ${year}`;
            img.style.maxWidth = '300px';
            img.style.maxHeight = '200px';
            img.style.objectFit = 'cover';
            img.classList.add('gallery-item');

            // Перевірка на співвідношення сторін
            img.onload = function () {
                if (img.naturalWidth === img.naturalHeight) {
                    img.style.display = 'none'; // Приховати фото 1:1
                }
            };

            img.onerror = function () {
                img.style.display = 'none'; // Приховати фото, які не завантажуються
                console.warn(`Image not found: ${imageUrl}`);
            };

            img.addEventListener('click', () => {
                openModal(index);
            });

            imageContainer.appendChild(img);
        });

        bottomSection.appendChild(imageContainer);

        currentImages = images;
    }

    // Відкрити модальне вікно
    function openModal(index) {
        currentImageIndex = index;
        modalImage.src = currentImages[currentImageIndex];
        modal.style.display = 'flex';
    }

    // Закрити модальне вікно
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Перегортання фото
    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        modalImage.src = currentImages[currentImageIndex];
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        modalImage.src = currentImages[currentImageIndex];
    });

    // Закрити модальне вікно при натисканні поза зображенням
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});