

let pendingId = '';

// Define networks by country
const networks = {
    'CM': ['MTN', 'Orange Money'],
    'SN': ['Orange Money'],
    'CI': ['MTN', 'Orange Money', 'Moov Money'],
    'BF': ['Orange Money'],// Not Even there

    'GH': ['MTN', 'TIGO', 'VODAFONE'], // composery

    'UG': ['MTN', 'Airtel'],//Not composery
    'TZ': ['Vodafone', 'Airtel', 'Tigo', 'Halopesa'],//Not composery
    'RW': ['MTN', 'Airtel Money'],//Not EVEN there
    'ZM': ['MTN', 'Airtel Money', 'Zamtel'],//Not composery
    'KE': ['M-PESA'],//Not EVEN there
    'NG': ['Paga'] // Example, adjust based on actual data
};

// Object to map country codes to phone number codes
const countryPhoneCodes = {
    'CM': '237', // Cameroon
    'SN': '221', // Senegal
    'CI': '225', // Côte d'Ivoire
    'BF': '226', // Burkina Faso
    'GH': '233', // Ghana
    'UG': '256', // Uganda
    'TZ': '255', // Tanzania
    'RW': '250', // Rwanda
    'ZM': '260', // Zambia
    'KE': '254', // Kenya
    'NG': '234'  // Nigeria
};

// Object to map country codes to their respective currencies
const countryToCurrency = {
    'CM': 'XAF', // Cameroon
    'CF': 'XAF', // Central African Republic
    'TD': 'XAF', // Chad
    'CG': 'XAF', // Republic of the Congo
    'GQ': 'XAF', // Equatorial Guinea
    'GA': 'XAF', // Gabon
    'BJ': 'XOF', // Benin
    'BF': 'XOF', // Burkina Faso
    'CI': 'XOF', // Côte d'Ivoire
    'GW': 'XOF', // Guinea-Bissau
    'ML': 'XOF', // Mali
    'NE': 'XOF', // Niger
    'SN': 'XOF', // Senegal
    'TG': 'XOF', // Togo
    'NG': 'NGN', // Nigeria
    'GH': 'GHS', // Ghana
    'KE': 'KES', // Kenya
    'UG': 'UGX', // Uganda
    'RW': 'RWF', // Rwanda
    'ZM': 'ZMW', // Zambia
    'TZ': 'TZS', // Tanzania
};


// Function to retrieve the country number code by country code
function getCountryNumberCode(countryCode) {
    return countryPhoneCodes[countryCode.toUpperCase()] || 'Country code not found';
}
// Function to retrieve currency by country code
function getCurrencyByCountryCode(countryCode) {
    return countryToCurrency[countryCode.toUpperCase()] || 'Currency code not found';
}




async function convertCurrency(amount, desiredCurrency) {
    try {
        // Replace 'YOUR_API_KEY' with your actual Flutterwave API key
        const url = `${serverUrl}/convertxfa?currency=${desiredCurrency}&amount=${amount}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch conversion rates');
        }

        const data = await response.json();

        console.log(data);

        return data.amount;

    } catch (error) {
        console.error('Error:', error);
        return {
            error: error.message
        };
    }
}


async function updateNetworks(countryCode) {
    const networkSelect = document.getElementById('network');
    const amount = document.getElementById('amount-disp');

    const amountXFA = document.getElementById('amount').value;


    networkSelect.innerHTML = ''; // Clear existing options


    // Get networks for the selected country
    const selectedNetworks = networks[countryCode];
    const currencyVal = getCurrencyByCountryCode(countryCode);

    const amountVal = Math.ceil(await convertCurrency(amountXFA, currencyVal));

    amount.innerHTML = `
        <sup class="currency">${currencyVal}</sup>
        ${amountVal}
    `;

    // Populate network select with new options
    if (selectedNetworks) {
        selectedNetworks.forEach(network => {
            const option = document.createElement('option');
            option.value = network;
            option.textContent = network;
            networkSelect.appendChild(option);
        });
    }
}


async function confirmPayment() {
    const modal = document.getElementById('loading-modal');
    const modalText = document.getElementById('modal-text');
    const loader = document.getElementById('loader');

    const phoneNumber = document.getElementById('phone-number').value;
    const country = document.getElementById('country').value;
    const network = document.getElementById('network').value;
    const amount = document.getElementById('amount').value;
    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    if (!phoneNumber || !country || !network || !amount || !email || !name) {
        throw new Error('All fields are required');
    }

    // Show the modal with a loading message
    modal.style.display = 'flex';
    modalText.textContent = 'Lancement de la requette de paiement';

    try {

        const phone = getCountryNumberCode(country) + phoneNumber;
        const currency = getCurrencyByCountryCode(country);

        const data = {
            phone: phone,
            country: country,
            network: network,
            amount: amount,
            email: email,
            name: name,
            currency: currency,
        };

        const response = await fetch(serverUrl + '/initpayment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const responseData = await response.json();
        console.log('Success:', responseData);

        pendingId = responseData.pendingId;

        // Update modal text to show the approval message
        modalText.textContent = 'Requette effectue a avec succes. Veillez valider la requette de paiement';

        loader.classList.add('loader-50');
        setInterval(checkPaymentStatus, 10000); // 10000 milliseconds = 10 seconds


    } catch (error) {
        console.error('Error:', error);

        modalText.textContent = 'Échec de la confirmation de paiement';
        loader.classList.add('loader-error');

        setTimeout(() => {
            modal.style.display = 'none';
            loader.classList = ['loader'];
        }, 5000);
    }
}

async function checkPaymentStatus() {
    const modalText = document.getElementById('modal-text');
    const loader = document.getElementById('loader');
    const redirect = document.getElementById('redirect').value;

    const response = await fetch(serverUrl + '/checkpayment?pendingId=' + pendingId);

    if (!response.ok) {
        if (data.status === 'failed') {
            modalText.textContent = 'Paiement echoue';
            loader.classList.add('loader-error');
            return;
        }
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Payment status:', data.status);

    if (data.status === 'success') {
        modalText.textContent = 'Paiement effectue avec succes';
        loader.classList.add('loader-100');
        loader.innerHTML = `
                        <div class="wrapper"> 
                            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>`;

        //redirect to web page
        setTimeout(() => {
            window.location.href = redirect;
            // window.location.href = 'https://sniperbuisnesscenter.com/';
        }, 3000);
    }

    if(data.status === 'failed'){
        modalText.textContent = 'Paiement echoue';
        loader.classList.add('loader-error');
    }

}



document.addEventListener('DOMContentLoaded', function () {
    // Initialize the network options based on the default selected country
    updateNetworks(document.getElementById('country').value);
});
