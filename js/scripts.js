
// Step 1: Fetch data from the Random User Generator API, limiting to English alphabet users

fetch('https://randomuser.me/api/?results=12&nat=us,gb,ca,au')
    .then(response => response.json()) // Convert the response to JSON
    .then(data => {
        displayUsers(data.results); // Pass the fetched users data to the display function
        addSearchFunctionality(data.results); // Add search functionality using fetched data
    })
    .catch(error => console.error('Error fetching data:', error)); // Log any errors

// Step 2: Function to display users in the gallery
function displayUsers(users) {
    const gallery = document.getElementById('gallery'); // Get the gallery container
    gallery.innerHTML = ''; // Clear gallery before displaying new results

    users.forEach(user => {
        // Create HTML for each user card
        const userHTML = `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${user.picture.large}" alt="Profile picture of ${user.name.first} ${user.name.last}">
                </div>
                <div class="card-info-container">
                    <h3 class="card-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="card-text">${user.email}</p>
                    <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                </div>
            </div>
        `;
        // Insert user card HTML into the gallery
        gallery.insertAdjacentHTML('beforeend', userHTML);
    });

    // Add event listeners to cards to display modal on click
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            displayModal(users, index); // Display modal for the clicked user
        });
    });
}

// Step 3: Function to display a modal with detailed user information
function displayModal(users, index) {
    const user = users[index];
    
    // Create HTML for the modal
    const modalHTML = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${user.picture.large}" alt="Profile picture of ${user.name.first} ${user.name.last}">
                    <h3 class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="modal-text">${user.email}</p>
                    <p class="modal-text cap">${user.location.city}</p>
                    <hr>
                    <p class="modal-text">${user.phone}</p>
                    <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.postcode}</p>
                    <p class="modal-text">Birthday: ${new Date(user.dob.date).toLocaleDateString()}</p>
                </div>
                <div class="modal-btn-container">
                    <button type="button" class="modal-prev btn">Prev</button>
                    <button type="button" class="modal-next btn">Next</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML); // Insert modal HTML into the body

    // Close modal when close button is clicked
    const closeButton = document.querySelector('.modal-close-btn');
    closeButton.addEventListener('click', () => {
        document.querySelector('.modal-container').remove(); // Remove the modal from the DOM
    });

    // Add functionality to "Prev" and "Next" buttons for modal navigation
    const prevButton = document.querySelector('.modal-prev');
    const nextButton = document.querySelector('.modal-next');

    // Disable "Prev" button if at the beginning, disable "Next" if at the end
    if (index === 0) {
        prevButton.disabled = true;
    }
    if (index === users.length - 1) {
        nextButton.disabled = true;
    }

    prevButton.addEventListener('click', () => {
        if (index > 0) {
            document.querySelector('.modal-container').remove(); // Remove the current modal
            displayModal(users, index - 1); // Display the previous user's modal
        }
    });

    nextButton.addEventListener('click', () => {
        if (index < users.length - 1) {
            document.querySelector('.modal-container').remove(); // Remove the current modal
            displayModal(users, index + 1); // Display the next user's modal
        }
    });
}

// Step 4: Search functionality
function addSearchFunctionality(users) {
    const searchInput = document.getElementById('search-input');

    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = users.filter(user => {
            const name = `${user.name.first} ${user.name.last}`.toLowerCase();
            const location = `${user.location.city}, ${user.location.state}`.toLowerCase();
            return name.includes(searchTerm) || location.includes(searchTerm);
        });

        // Re-display users based on the filtered results
        displayUsers(filteredUsers);
    });
}
