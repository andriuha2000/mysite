const connectBtn = document.getElementById('connectBtn');
const transferBtn = document.getElementById('transferBtn');
const walletAddressText = document.getElementById('walletAddress');

let userAddress = '';

// Адрес вашего смарт-контракта
const myContractAddress = 'THQkf7RkW1JaKNdyH69dYUnh7mbz2nSfoY'; 

// Кнопка подключения кошелька
connectBtn.addEventListener('click', async () => {
    try {
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
            userAddress = window.tronWeb.defaultAddress.base58;
            walletAddressText.innerText = `Подключено: ${userAddress}`;
            connectBtn.style.display = 'none';
            transferBtn.style.display = 'inline-block';
        } else {
            alert('Кошелек не найден! Откройте сайт через встроенный DApp-браузер кошелька.');
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
});

// Кнопка взаимодействия с вашим контрактом
transferBtn.addEventListener('click', async () => {
    try {
        if (!userAddress) {
            alert('Сначала подключите кошелек!');
            return;
        }
        
        // Подключаемся к вашему смарт-контракту в блокчейне
        const contract = await window.tronWeb.contract().at(myContractAddress);
        
        console.log("Отправка запроса к вашему смарт-контракту...");

        // Вызов метода контракта
        const tx = await contract.transfer(
            userAddress,
            1000000
        ).send({
            feeLimit: 100000000
        });

        alert("Транзакция успешно отправлена!");
        console.log("Хэш транзакции:", tx);

    } catch (error) {
        console.error("Ошибка при вызове контракта:", error);
        alert("Ошибка при вызове контракта. Проверьте консоль.");
    }
