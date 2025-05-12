window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500); // Затримка для плавного зникнення
});

document.addEventListener('DOMContentLoaded', function () {
    const output = document.getElementById('outputField');
    const fileSelector = document.getElementById('dataFile');
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

    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentImageIndex = 0;
    let currentImages = [];

    // Завантаження даних при зміні файлу
    fileSelector.addEventListener('change', () => {
        const selectedFile = fileSelector.value;
        loadData(selectedFile);
    });

    // Завантаження даних із початкового файлу
    loadData(fileSelector.value);

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